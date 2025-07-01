import express from "express";
import serverless from "serverless-http";
import { registerRoutes } from "./routes";
import { AppDataSource } from "./infrastructure/typeorm/typeorm.config";
import swaggerUi from 'swagger-ui-express';
import fs from 'fs';
import path from 'path';

const app = express();
AppDataSource.initialize()
.then(() => {
    console.log("✅ Base de datos conectada correctamente");
})
.catch((error) => {
    console.error("❌ Error de conexión a la base de datos:", error);
});

app.use(express.json());
const swaggerPath = path.resolve(__dirname, 'src/build/swagger.json');
const spec = JSON.parse(fs.readFileSync(swaggerPath, 'utf8'));

app.use('/docs', swaggerUi.serve, swaggerUi.setup(spec));
registerRoutes(app);

export const handler = serverless(app);