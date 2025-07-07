import 'dotenv/config';
import express from "express";
import cors from "cors";
import { StatusCodes } from "http-status-codes";

import AlumnosRouter from "./controllers/alumnos-controller.js";
import CursosRouter from "./controllers/cursos-controller.js";

const app = express();
const port = process.env.PORT ?? 3000;

app.use(cors());
app.use(express.json());

app.use("/api/alumnos", AlumnosRouter);
app.use("/api/cursos", CursosRouter);


app.use((req, res) => {
    res.status(StatusCodes.NOT_FOUND).send("Endpoint no encontrado");
});

app.listen(port, () => {
    console.log(`Servidor escuchando en http://localhost:${port}`);
});
