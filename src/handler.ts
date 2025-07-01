import express from "express";
import serverless from "serverless-http";
import { registerRoutes } from "./routes";
import { AppDataSource } from "./infrastructure/typeorm/typeorm.config";

import path from 'path';
import swaggerUi from 'swagger-ui-express';
import fs from 'fs';

const app = express();
AppDataSource.initialize()
.then(() => {
    console.log("✅ Base de datos conectada correctamente");
})
.catch((error) => {
    console.error("❌ Error de conexión a la base de datos:", error);
});

app.use(express.json());
const swaggerDocument = JSON.parse(
  fs.readFileSync(path.resolve(__dirname, './build/swagger.json'), 'utf8')
);
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
registerRoutes(app);

export const handler = serverless(app);