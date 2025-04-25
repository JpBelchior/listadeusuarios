import express from "express";
import userControllers from "../../controllers/userControllers";
const router = express.Router();
import { Request, Response } from "express";

router.get("/", userControllers.getAllUsers);

export default router;
