import express from "express";
import { CursosService } from "../services/cursos-service.js";
import { StatusCodes } from "http-status-codes";

const router = express.Router();

router.get("/", async (req, res) => {
    const cursos = await CursosService.getAll();
    res.status(StatusCodes.OK).json(cursos);
});



export default router;
