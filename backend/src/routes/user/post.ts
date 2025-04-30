import express from "express";
import userControllers from "../../controllers/userControllers";
const router = express.Router();
import userMiddleware from "../../middleware/userMiddleware";

router.post(
  "/",
  userMiddleware.validateUserUsername,
  userMiddleware.validateUserPassword,
  userMiddleware.validateUserUsernameExists,
  userControllers.createUser
);

export default router;
