import connectDB from "../config/db";
import { User } from "./User";

const getAll = async () => {
  try {
    const [rows] = await connectDB.execute("SELECT * FROM users");
    return rows;
  } catch (error) {
    console.error("Erro ao buscar usuários:", error); // 👈 Aqui ele vai mostrar o erro real
    throw error;
  }
};

const getUserById = async (id: number) => {
  const query = "SELECT * FROM users WHERE id = ?";
  const [user]: any = await connectDB.execute(query, [id]);

  if (user.length === 0) {
    throw new Error("Usuário não encontrado.");
  }

  return user[0];
};

const createUser = async (user: User) => {
  const { username, password, gender } = user;
  const date = new Date(Date.now()).toUTCString();

  const query =
    "INSERT INTO users (username, password, gender,created_at) VALUES (?, ?, ?,?)";

  const [createdUser] = await connectDB.execute(query, [
    username,
    password,
    gender,
    date,
  ]);

  return {
    id: (createdUser as any).insertId,
    username,
    gender,
    created_at: date,
    message: `Usuário ${username} criado com sucesso!`,
  };
};

const deleteUser = async (id: number) => {
  const query = "DELETE FROM users WHERE id = ?";
  const [deletedUser] = await connectDB.execute(query, [id]);
  return {
    message: `Usuário ${id} deletado com sucesso!`,
  };
};

const updateUser = async (id: number, username: string) => {
  const query = "UPDATE users SET username = ? WHERE id = ?";
  const [updatedUser] = await connectDB.execute(query, [username, id]);

  return {
    id,
    username,
    message: `Usuário com id ${id} atualizado para ${username}`,
  };
};

export default {
  getAll,
  getUserById,
  createUser,
  deleteUser,
  updateUser,
};
