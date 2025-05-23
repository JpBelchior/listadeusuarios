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
        message:
          "Se o usuário existir, as instruções foram enviadas por email.",
        // Para desenvolvimento, mostre se o email foi enviado:
        emailSent: emailSent, // Remova em produção
      });
    } catch (error) {
      console.error("Erro na recuperação de senha:", error);
      res.status(500).json({ message: "Erro no servidor" });
    }
  };
};

export default {
  login,
  getAuthUser,
};
