import { Request, Response } from "express";
import userModel from "../models/userModel";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import emailService from "../service/emailService";
const JWT_SECRET = process.env.JWT_SECRET || "meuSegredoJWT"; // Use uma variável de ambiente em produção

// Login de usuário
const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { username, password } = req.body;

    // Verificar se o usuário existe
    const user = await userModel.getUserByUsername(username);
    console.log("Usuário encontrado no banco:", user ? "SIM" : "NÃO");

    if (!user) {
      console.log("❌ Usuário não encontrado");
      res.status(401).json({ message: "Credenciais inválidas" });
      return;
    }

    // Verificar senha

    const isMatch = await bcrypt.compare(password, user.password);
    console.log("Senhas coincidem:", isMatch ? "SIM" : "NÃO");

    if (!isMatch) {
      console.log("❌ Senha incorreta");
      res.status(401).json({ message: "Credenciais inválidas" });
      return;
    }

    console.log("✅ Login bem-sucedido!");

    // Criar e assinar o token JWT
    const payload = {
      user: {
        id: user.id,
      },
    };

    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "24h" });

    // Remover senha antes de enviar
    const { password: _, ...userWithoutPassword } = user;

    res.status(200).json({
      token,
      user: userWithoutPassword,
      message: "Login realizado com sucesso",
    });
  } catch (error) {
    console.error("Erro no login:", error);
    res.status(500).json({ message: "Erro no servidor" });
  }
};

// Obter usuário autenticado
const getAuthUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = await userModel.getUserById(req.user.id);

    if (!user) {
      res.status(404).json({ message: "Usuário não encontrado" });
      return;
    }

    // Remover senha antes de enviar
    const { password, ...userWithoutPassword } = user;

    res.status(200).json(userWithoutPassword);
  } catch (error) {
    console.error("Erro ao obter usuário autenticado:", error);
    res.status(500).json({ message: "Erro no servidor" });
  }
};
const forgotPassword = async (req: Request, res: Response): Promise<void> => {
  try {
    const { username } = req.body;

    if (!username) {
      res.status(400).json({ message: "Nome de usuário é obrigatório" });
      return;
    }

    // Verificar se o usuário existe
    const user = await userModel.getUserByUsername(username);

    if (!user) {
      // Por segurança, sempre retorna sucesso
      res.status(200).json({
        message:
          "Se o usuário existir, as instruções foram enviadas por email.",
      });
      return;
    }

    if (!user.email) {
      console.log(`Usuário ${username} não tem email cadastrado`);
      res.status(200).json({
        message:
          "Se o usuário existir, as instruções foram enviadas por email.",
      });
      return;
    }

    // Gerar token de recuperação
    const resetToken = jwt.sign(
      {
        userId: user.id,
        email: user.email,
        timestamp: Date.now(),
      },
      JWT_SECRET + user.password, // Inclui senha atual na chave
      { expiresIn: "1h" }
    );

    // Enviar email
    const emailSent = await emailService.sendPasswordResetEmail(
      user.email,
      user.username,
      resetToken
    );

    if (emailSent) {
      console.log(`✅ Email de recuperação enviado para ${user.email}`);
    } else {
      console.log(`❌ Falha ao enviar email para ${user.email}`);
    }

    // Sempre retorna sucesso por segurança
    res.status(200).json({
      message: "Se o usuário existir, as instruções foram enviadas por email.",
      // Para desenvolvimento, mostre se o email foi enviado:
      emailSent: emailSent, // Remova em produção
    });
  } catch (error) {
    console.error("Erro na recuperação de senha:", error);
    res.status(500).json({ message: "Erro no servidor" });
  }
};

const resetPassword = async (req: Request, res: Response): Promise<void> => {
  try {
    const { token, password } = req.body;

    // Verificar se token e senha foram fornecidos
    if (!token || !password) {
      res.status(400).json({
        message: "Token e nova senha são obrigatórios",
      });
      return;
    }

    // Verificar se a senha tem pelo menos 6 caracteres
    if (password.length < 6) {
      res.status(400).json({
        message: "A senha deve ter pelo menos 6 caracteres",
      });
      return;
    }

    // Primeiro, decodificar o token para pegar o ID do usuário
    let decoded;
    try {
      decoded = jwt.decode(token) as any;
      if (!decoded || !decoded.userId) {
        res.status(400).json({ message: "Token inválido" });
        return;
      }
    } catch (error) {
      res.status(400).json({ message: "Token mal formado" });
      return;
    }

    // Buscar o usuário no banco de dados
    const user = await userModel.getUserById(decoded.userId);
    if (!user) {
      res.status(400).json({ message: "Usuário não encontrado" });
      return;
    }

    // Verificar o token usando a senha atual como parte da chave
    try {
      jwt.verify(token, JWT_SECRET + user.password);
    } catch (error) {
      res.status(400).json({
        message: "Token inválido ou expirado. Solicite uma nova recuperação.",
      });
      return;
    }

    // Verificar se o token não é muito antigo (adicional de segurança)
    const tokenAge = Date.now() - decoded.timestamp;
    const oneHour = 60 * 60 * 1000; // 1 hora em milissegundos

    if (tokenAge > oneHour) {
      res.status(400).json({
        message: "Token expirado. Solicite uma nova recuperação.",
      });
      return;
    }

    // Criptografar a nova senha
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Atualizar a senha no banco de dados
    await userModel.updateUserPassword(user.id, hashedPassword);

    console.log(`✅ Senha redefinida para usuário ID: ${user.id}`);

    res.status(200).json({
      message: "Senha redefinida com sucesso!",
      success: true,
    });
  } catch (error) {
    console.error("Erro ao redefinir senha:", error);
    res.status(500).json({
      message: "Erro interno do servidor",
    });
  }
};

export default {
  resetPassword,
  login,
  getAuthUser,
  forgotPassword,
};
