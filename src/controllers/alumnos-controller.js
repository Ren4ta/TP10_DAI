import express from "express";
import { AlumnosService } from "../services/alumnos-service.js";
import { StatusCodes } from "http-status-codes";

const router = express.Router();

router.get("/", async (req, res) => {
    const alumnos = await AlumnosService.getAll();
    res.status(StatusCodes.OK).json(alumnos);
});

router.get("/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) return res.status(StatusCodes.BAD_REQUEST).send("ID inválido");
    const alumno = await AlumnosService.getById(id);
    if (!alumno) return res.status(StatusCodes.NOT_FOUND).send("Alumno no encontrado");
    res.status(StatusCodes.OK).json(alumno);
});

router.post("/", async (req, res) => {
    try {
        const ok = await AlumnosService.create(req.body);
        if (ok) return res.status(StatusCodes.CREATED).send("Alumno creado");
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).send("No se pudo crear el alumno");
    } catch (error) {
        res.status(StatusCodes.BAD_REQUEST).send(error.message);
    }
});

router.put("/", async (req, res) => {
    try {
        const ok = await AlumnosService.update(req.body);
        if (ok) return res.status(StatusCodes.CREATED).send("Alumno actualizado");
        res.status(StatusCodes.NOT_FOUND).send("Alumno no encontrado");
    } catch (error) {
        res.status(StatusCodes.BAD_REQUEST).send(error.message);
    }
});

router.delete("/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) return res.status(StatusCodes.BAD_REQUEST).send("ID inválido");
    const ok = await AlumnosService.delete(id);
    if (ok) return res.status(StatusCodes.OK).send("Alumno eliminado");
    res.status(StatusCodes.NOT_FOUND).send("Alumno no encontrado");
});

export default router;
