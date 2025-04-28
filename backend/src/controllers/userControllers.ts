import userModel from "../models/userModel";
import { User } from "../models/User";
import bcrypt from "bcryptjs";
import { Request, Response } from "express";

const getAllUsers = async (_req: Request, res: Response): Promise<void> => {
  try {
    const users = await userModel.getAll();
    res.status(200).json(users);
  } catch (error) {
    console.error("Erro ao buscar usuários:", error);
    res.status(500).json({ message: "Erro ao buscar usuários." });
  }
};

const getUserById = async (id: number) => {
  if (!id) {
    throw new Error("Id é obrigatório.");
  }
  const user = await userModel.getUserById(id);
  if (!user) {
    throw new Error("Usuário não encontrado.");
  }
  return user;
};

const createUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { username, password, gender } = req.body;

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser: User = {
      username,
      password: hashedPassword,
      gender,
      created_at: new Date(Date.now()).toUTCString(),
      id: 0, // será sobrescrito pelo BD
    };

    const created = await userModel.createUser(newUser);
    res.status(201).json(created);
  } catch (error) {
    console.error("Erro ao criar usuário:", error);
    res.status(500).json({ message: "Erro ao criar usuário." });
  }
};

const deleteUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.body;

    if (!id) {
      res.status(400).json({ message: "Id é obrigatório." });
      return;
    }

    const result = await userModel.deleteUser(parseInt(id));
    res.status(200).json(result);
  } catch (error) {
    if (error instanceof Error) {
      console.error("Erro ao deletar usuário:", error.message);
      res.status(500).json({ message: error.message });
    } else {
      console.error("Erro desconhecido:", error);
      res.status(500).json({ message: "Erro ao deletar usuário." });
    }
  }
};

const updateUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { username, gender } = req.body;

    const updatedUser = await userModel.updateUser(
      parseInt(id),
      req.body.username,
      req.body.gender
    );

    res.status(200).json(updatedUser);
  } catch (error) {
    console.error("Erro ao atualizar usuário:", error);
    res.status(500).json({ message: "Erro ao atualizar usuário." });
  }
};

export default {
  getAllUsers,
  createUser,
  deleteUser,
  updateUser,
  getUserById,
};
