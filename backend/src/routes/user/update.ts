import express from "express";
import userControllers from "../../controllers/userControllers";
import userMiddleware from "../../middleware/userMiddleware";
const routerUpdate = express.Router();

routerUpdate.put(
  "/:id",
  userMiddleware.validateUserUsername,
  userMiddleware.validateUserGender,
  userControllers.updateUser
);

export default routerUpdate;
