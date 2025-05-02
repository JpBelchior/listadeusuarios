import type { Express } from "express";
import { Router as ExpressRouter } from "express";

import usersDeleteRoute from "./user/delete";
import usersPostRoute from "./user/post";
import usersGetRoute from "./user/get";
import usersPutRoute from "./user/update";

import authGetRoute from "./auth/get";
import authPostRoute from "./auth/post";

function setupUserRoutes(app: Express) {
  const userRouter = ExpressRouter();

  userRouter.use(usersPostRoute);
  userRouter.use(usersGetRoute);
  userRouter.use(usersPutRoute);
  userRouter.use(usersDeleteRoute);
  app.use("/user", userRouter);
}

function setupAuthRoutes(app: Express) {
  const authRouter = ExpressRouter();

  authRouter.use(authPostRoute);
  authRouter.use(authGetRoute);
  app.use("/auth", authRouter);
}

export function routerSetup(app: Express) {
  setupUserRoutes(app);
  setupAuthRoutes(app);
}
