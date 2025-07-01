import { Express, Request, Response } from "express";
import { SwapiCharacterRepository } from "./infrastructure/swapi/swapi-character.repository";
import { GetMergeDataUseCase } from "./application/get-merge.use-case";
import { PokeApiRepository } from './infrastructure/pokeapi/pokeapi.repository';
import { SaveHistoryDataUseCase } from "./application/save-history-data.use-case";
import { DynamoDBHistoryDataRepository } from "./infrastructure/dynamodb/history-data.repository";
import { DynamoDBCacheRepository } from "./infrastructure/cache/dynamo-cache.repository";
import { DynamoDBCustomDataRepository } from "./infrastructure/dynamodb/custom-data.repository";
import { asyncHandler } from "./shared/functions/AsyncHandler";
import { formatPeruDateTime } from "./shared/functions/DateTimeFormat";


export function registerRoutes(app: Express) {
    app.get("/fusionados", asyncHandler(async (req: Request, res: Response) => {
    console.log("GET /fusionados");
    const { page = "1", limit = "10" } = req.query;
    const cacheKey = `fusionados:${page}:${limit}`;
    const cacheRepo = new DynamoDBCacheRepository();

    try {
        // Buscar en caché
        const cached = await cacheRepo.getCache(cacheKey);
        if (cached) {
        console.log("Retornando data desde cache ⚡");
        return res.status(200).json({
            page: parseInt(page as string),
            limit: parseInt(limit as string),
            totalItems: cached.totalItems,
            data: cached.data
        });
        }

        console.log("No se encontró en cache 😓. Trayendo data desde Swapi y PokeApi");
        const swapiRepo = new SwapiCharacterRepository();
        const pokeApi = new PokeApiRepository();
        const mergeDataUseCase = new GetMergeDataUseCase(swapiRepo, pokeApi);

        const mergeData = await mergeDataUseCase.execute(parseInt(page as string), parseInt(limit as string));

        // Guardar en caché
        await cacheRepo.setCache(cacheKey, mergeData);

        // Guardar en histórico
        const historyDataRepository = new DynamoDBHistoryDataRepository()
        const saveHistoryData = new SaveHistoryDataUseCase(historyDataRepository);
        await saveHistoryData.save(mergeData.data);

        return res.status(200).json(mergeData);
    } catch (error) {
        console.error("Error al mostrar la data de pokeApi y Swapi:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
    }));

    app.post("/almacenar", asyncHandler(async (req: Request, res: Response) => {
        const customDataRepository = new DynamoDBCustomDataRepository();
        try {
            const payload = req.body;

            if (!payload || typeof payload !== "object" || Object.keys(payload).length === 0) {
                return res.status(400).json({ error: "El contenido a almacenar es invalido." });
            }

            // cambiando el dateTime para que sea en un formato legible para el usuario
            const {createdAt, ...otherFields} = await customDataRepository.save(payload);
            const customDate = formatPeruDateTime(createdAt);
            const result = {
                ...otherFields.data,
                createdAt: customDate
            }

            return res.status(201).json({ message: "Datos guardados exitosamente", data: result });
        } catch (error) {
            console.error("Error guardando data personalizada:", error);
            return res.status(500).json({ error: "Internal Server Error" });
        }
    }));

    app.get('/historial', asyncHandler( async (req: Request, res: Response) => {
        console.log("GET /historial called");
        const { limit = "10" } = req.query;
        const lastKeyId = req.query["lastKey"];

        let startKey: Record<string, any> | undefined = undefined;
        if (lastKeyId) {
            startKey = { id: { S: String(lastKeyId) } };
        }
        console.log("limit:", limit, "startKey:", startKey);
        const historyDataRepository = new DynamoDBHistoryDataRepository();

        try {
            const historyData = await historyDataRepository.history(parseInt(limit as string), startKey);
            return res.status(200).json({
                limit: parseInt(limit as string),
                totalItems: historyData.items.length,
                data: historyData.items,
                nextPage: historyData.lastKey || null
            });
        } catch (error) {
            console.error("Error mostrando la data del historial:", error);
            return res.status(500).json({ error: "Internal Server Error" });
        }
    }));
}
