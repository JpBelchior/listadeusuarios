import { Request, Response, NextFunction } from "express";

const validateUserUsername = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { body } = req;
  if (body.username === undefined || body.username === "") {
    res.status(400).json({ message: "O campo username é obrigatório" });
    return;
  }
  next();
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

export default { validateUserPassword, validateUserUsername };
