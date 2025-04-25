import express from "express";
import userControllers from "../../controllers/userControllers";
const router = express.Router();
import { Request, Response } from "express";
import userMiddleware from "../../middleware/userMiddleware";

router.post(
  "/",
  userMiddleware.validateUserPassword,
  userMiddleware.validateUserPassword,
  userControllers.createUser
);

export default router;
