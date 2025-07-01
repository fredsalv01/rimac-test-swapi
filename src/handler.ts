import express from "express";
import serverless from "serverless-http";
import { registerRoutes } from "./routes";
import { AppDataSource } from "./infrastructure/typeorm/typeorm.config";

const app = express();
AppDataSource.initialize()
.then(() => {
    console.log("✅ Base de datos conectada correctamente");
})
.catch((error) => {
    console.error("❌ Error de conexión a la base de datos:", error);
});
app.use(express.json());

// Registra las rutas externas
registerRoutes(app);

export const handler = serverless(app);