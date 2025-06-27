import serverless from "serverless-http";
import express, { Request, Response } from "express";

const app = express();

app.get("/", (req: Request, res: Response) => {
  res.status(200).json({ message: "Hello from root!" });
});

app.get("/hello", (req: Request, res: Response) => {
  res.status(200).json({ message: "Hello from path!" });
});

app.use((req: Request, res: Response) => {
  res.status(404).json({ error: "Not Found" });
});

export const handler = serverless(app);
