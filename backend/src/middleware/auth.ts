import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'jwtSecret';

interface TokenPayload {
  user: {
    id: string;
  };
}

export default function(req: Request, res: Response, next: NextFunction): void {
  // Pegar o token do header
  const token = req.header('x-auth-token');

  // Verificar se não há token
  if (!token) {
    res.status(401).json({ msg: 'Sem token, autorização negada' });
    return;
  }

  // Verificar o token
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as TokenPayload;
    req.user = decoded.user;
    next();
  } catch (err) {
    res.status(401).json({ msg: 'Token inválido' });
  }
}