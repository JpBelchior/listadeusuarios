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
  const { username, password, email, gender } = user;
  const date = new Date(Date.now()).toUTCString();

  const query =
    "INSERT INTO users (username, password, email, gender,created_at) VALUES (?, ?, ?,?,?)";

  const [createdUser] = await connectDB.execute(query, [
    username,
    password,
    email,
    gender,
    date,
  ]);

  return {
    username,
    email,
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

const updateUser = async (id: number, username: string, gender: string) => {
  const query = "UPDATE users SET username = ? , gender =? WHERE id = ?";
  const [updatedUser] = await connectDB.execute(query, [username, gender, id]);

  return {
    id,
    username,
    gender,
    message: `Usuário com id ${id} atualizado para ${username}`,
  };
};

const getUserByUsername = async (username: string) => {
  try {
    const query = "SELECT * FROM users WHERE username = ?";
    const [rows]: any = await connectDB.execute(query, [username]);
    return rows[0]; // Retorna o primeiro usuário encontrado
  } catch (error) {
    console.error("Erro ao buscar usuário por username:", error);
    throw error;
  }
};

const updateUserPassword = async (id: number, hashedPassword: string) => {
  try {
    const query = "UPDATE users SET password = ? WHERE id = ?";
    const [result] = await connectDB.execute(query, [hashedPassword, id]);

    return {
      id,
      message: `Senha atualizada com sucesso para usuário ID ${id}`,
    };
  } catch (error) {
    console.error("Erro ao atualizar senha:", error);
    throw error;
  }
};

export default {
  getAll,
  getUserById,
  createUser,
  deleteUser,
  updateUser,
  getUserByUsername,
  updateUserPassword,
};
