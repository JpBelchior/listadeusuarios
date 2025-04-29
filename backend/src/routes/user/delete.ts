import express from "express";
import userControllers from "../../controllers/userControllers";
const routerDelete = express.Router();
import { Request, Response } from "express";
import userMiddleware from "../../middleware/userMiddleware";

routerDelete.delete(
  "/",
  userMiddleware.validateUserId,
  userControllers.deleteUser
);
export default routerDelete;
