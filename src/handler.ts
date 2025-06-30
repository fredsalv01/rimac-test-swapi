import express from "express";
import serverless from "serverless-http";
import { registerRoutes } from "./routes";

const app = express();
app.use(express.json());

// Registra las rutas externas
registerRoutes(app);

export const handler = serverless(app);