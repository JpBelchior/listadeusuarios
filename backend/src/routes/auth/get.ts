import express from "express";
import authControllers from "../../controllers/authControllers";
import authMiddleware from "../../middleware/auth";
const router = express.Router();

// Rota para obter o usuário autenticado
router.get("/me", authMiddleware, authControllers.getAuthUser);

export default router;
