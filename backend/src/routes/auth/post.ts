import express from "express";
import authControllers from "../../controllers/authControllers";
const router = express.Router();

// Rota de login
router.post("/login", authControllers.login);

export default router;
