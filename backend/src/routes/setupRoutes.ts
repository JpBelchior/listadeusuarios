import type { Express } from "express";
import { Router as ExpressRouter } from "express";

import usersDeleteRoute from "./user/delete";
import usersPostRoute from "./user/post";
import usersGetRoute from "./user/get";
import usersPutRoute from "./user/update";

function setupUserRoutes(app: Express) {
  const userRouter = ExpressRouter();

  userRouter.use(usersPostRoute);
  userRouter.use(usersGetRoute);
  userRouter.use(usersPutRoute);
  userRouter.use(usersDeleteRoute);
  app.use("/user", userRouter);
}

export function routerSetup(app: Express) {
  setupUserRoutes(app);
}
