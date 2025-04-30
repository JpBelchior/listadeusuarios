import { Request, Response, NextFunction } from "express";

import userModel from "../models/userModel";

const validateUserId = (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  const { body } = req;
  if (
    (id === undefined || id === "") &&
    (body.id === undefined || body.id === "")
  ) {
    res.status(400).json({ message: "O campo id é obrigatório" });
    return;
  }
  next();
};

const validateUserUsername = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { body } = req;
  if (
    body.username === undefined ||
    body.username === "" ||
    body.username.trim() === ""
  ) {
    res.status(400).json({ message: "O campo username é obrigatório" });
    return;
  }
  next();
};

const validateUserUsernameExists = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { body } = req;

  try {
    const users = await userModel.getUserByUsername(body.username);

    // Verificar se o array de usuários tem pelo menos um elemento
    if (users) {
      res.status(400).json({ message: "Esse username já existe" });
      return;
    }

    next();
  } catch (error) {
    console.error("Erro ao verificar username:", error);
    res
      .status(500)
      .json({ message: "Erro ao verificar disponibilidade do username" });
  }
};

const validateUserPassword = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { body } = req;
  if (body.password === undefined || body.password === "") {
    res.status(400).json({ message: "O campo password é obrigatório" });
    return;
  }

  next();
};
const validateUserGender = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { body } = req;
  if (body.gender === undefined || body.gener === "") {
    res.status(400).json({ message: "O campo gender é obrigatório" });
    return;
  }
  next();
};

export default {
  validateUserPassword,
  validateUserUsername,
  validateUserGender,
  validateUserId,
  validateUserUsernameExists,
};
