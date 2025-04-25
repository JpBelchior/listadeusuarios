import express from "express";
import { routerSetup } from "./routes/setupRoutes";
import cors from "cors";

const app = express();

app.use(express.json());

app.use(cors());

routerSetup(app);

export default app;
