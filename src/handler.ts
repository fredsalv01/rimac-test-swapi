import serverless from "serverless-http";
import express, { Request, Response } from "express";
import { SwapiCharacterRepository } from "./infrastructure/swapi/swapi-character.repository";
import { GetMergeDataUseCase } from "./application/get-merge.use-case";
import { PokeApiRepository } from './infrastructure/pokeapi/pokeapi.repository';
import { SaveHistoryDataUseCase } from "./application/save-history-data.use-case";
import { DynamoDBHistoryDataRepository } from "./infrastructure/dynamodb/history-data.repository";
import { DynamoDBCacheRepository } from "./infrastructure/cache/dynamo-cache.repository";

const app = express();

app.get("/fusionados", (req: Request, res: Response) => {
  (async () => {
    console.log("GET / called");
    const { page = "1", limit = "10" } = req.query;
    const cacheKey = `fusionados:${page}:${limit}`;
    const cacheRepo = new DynamoDBCacheRepository();

    // Buscar en caché
    const cached = await cacheRepo.getCache(cacheKey);
    if (cached) {
      console.log("Returning data from cache");
      return res.status(200).json({
        page: parseInt(page as string),
        limit: parseInt(limit as string),
        totalItems: cached.totalItems,
        data: cached.data
      });
    }

    const swapiRepo = new SwapiCharacterRepository();
    const pokeApi = new PokeApiRepository();
    const mergeDataUseCase = new GetMergeDataUseCase(swapiRepo, pokeApi);
    try {
      const mergeData = await mergeDataUseCase.execute(parseInt(page as string), parseInt(limit as string));
      // Guardar en caché
      await cacheRepo.setCache(cacheKey, mergeData);
      // Guardar en histórico
      const historyDataRepository = new DynamoDBHistoryDataRepository()
      const saveHistoryData = new SaveHistoryDataUseCase(historyDataRepository);
      await saveHistoryData.save(mergeData.data);
      res.status(200).json(mergeData);
    } catch (error) {
      console.error("Error fetching mergeData from Swapi and PokeApi:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  })();
});

app.post("/almacenar", (req: Request, res: Response) => {
  console.log("POST /almacenar");
  res.status(200).json({ message: "Hello from path!" });
});

app.get('/historial', async (req: Request, res: Response) => {
  console.log("GET /historial called");
  const { page = "1", limit = "10" } = req.query;
})

app.use((req: Request, res: Response) => {
  console.log("NOT FOUND / called");
  res.status(404).json({ error: "Not Found" });
});

export const handler = serverless(app);
