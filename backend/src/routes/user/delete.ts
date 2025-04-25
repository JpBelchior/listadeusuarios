import express from "express";
import userControllers from "../../controllers/userControllers";
const routerDelete = express.Router();
import { Request, Response } from "express";

routerDelete.delete("/", userControllers.deleteUser);
export default routerDelete;
