import express from "express";
import authControllers from "../../controllers/authControllers";

const router = express.Router();

// Rota de login
router.post("/login", authControllers.login);
// Rota para redefenir a senha
router.post("/forgot-password", authControllers.forgotPassword);
router.post("/reset-password", authControllers.resetPassword);

export default router;
