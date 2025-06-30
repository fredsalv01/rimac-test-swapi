import serverless from "serverless-http";
import express, { Request, Response } from "express";
import { SwapiCharacterRepository } from "./infrastructure/swapi/swapi-character.repository";
import { GetMergeDataUseCase } from "./application/get-merge.use-case";
import { PokeApiRepository } from './infrastructure/pokeapi/pokeapi.repository';

const app = express();

app.get("/", async (req: Request, res: Response) => {
  console.log("GET / called");
  const { page = "1", limit = "10" } = req.query;
  const swapiRepo = new SwapiCharacterRepository();
  const pokeApi = new PokeApiRepository();
  const useCase = new GetMergeDataUseCase(swapiRepo, pokeApi);
  try {
    const mergeData = await useCase.execute(parseInt(page as string), parseInt(limit as string));
    res.status(200).json(mergeData);
  } catch (error) {
    console.error("Error fetching mergeData from Swapi and PokeApi:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/hello", (req: Request, res: Response) => {
  console.log("GET /hello called");
  res.status(200).json({ message: "Hello from path!" });
});

app.use((req: Request, res: Response) => {
  console.log("NOT FOUND / called");
  res.status(404).json({ error: "Not Found" });
});

export const handler = serverless(app);
