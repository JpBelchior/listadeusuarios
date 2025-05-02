import { Request, Response } from "express";
import userModel from "../models/userModel";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "meuSegredoJWT"; // Use uma variável de ambiente em produção

// Login de usuário
const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { username, password } = req.body;

    // Verificar se o usuário existe
    const users = await userModel.getUserByUsername(username);

    if (!users) {
      res.status(401).json({ message: "Credenciais inválidas" });
      return;
    }

    const user = users;

    // Verificar senha
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      res.status(401).json({ message: "Credenciais inválidas" });
      return;
    }

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

export default {
  login,
  getAuthUser,
};
