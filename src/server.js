import express from "express";
import cors from "cors";
import config from './configs/db-config.js';
import pkg from 'pg';
import { StatusCodes } from "http-status-codes";

const { Client } = pkg;
const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

// GET /api/alumnos
app.get('/api/alumnos', async (req, res) => {
    const client = new Client(config);
    try {
        await client.connect();
        const result = await client.query('SELECT * FROM alumnos');
        res.status(StatusCodes.OK).json(result.rows);
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: error.message });
    } finally {
        await client.end();
    }
});

// GET /api/alumnos/:id
app.get('/api/alumnos/:id', async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) return res.status(StatusCodes.BAD_REQUEST).send("ID inválido");

    const client = new Client(config);
    try {
        await client.connect();
        const result = await client.query('SELECT * FROM alumnos WHERE id = $1', [id]);
        if (result.rows.length === 0) return res.status(StatusCodes.NOT_FOUND).send("Alumno no encontrado");
        res.status(StatusCodes.OK).json(result.rows[0]);
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: error.message });
    } finally {
        await client.end();
    }
});

// POST /api/alumnos
app.post('/api/alumnos', async (req, res) => {
    const { nombre, apellido, id_curso, fecha_nacimiento, hace_deportes } = req.body;

    if (!nombre || nombre.length < 3)
        return res.status(StatusCodes.BAD_REQUEST).send("El nombre debe tener al menos 3 letras");

    const client = new Client(config);
    try {
        await client.connect();
        await client.query(`
            INSERT INTO alumnos (nombre, apellido, id_curso, fecha_nacimiento, hace_deportes)
            VALUES ($1, $2, $3, $4, $5)`,
            [nombre, apellido, id_curso, fecha_nacimiento, hace_deportes]);
        res.status(StatusCodes.CREATED).send("Alumno creado");
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: error.message });
    } finally {
        await client.end();
    }
});

// PUT /api/alumnos
app.put('/api/alumnos', async (req, res) => {
    const { id, nombre, apellido, id_curso, fecha_nacimiento, hace_deportes } = req.body;

    if (!id)
        return res.status(StatusCodes.BAD_REQUEST).send("Falta el ID");

    if (!nombre || nombre.length < 3)
        return res.status(StatusCodes.BAD_REQUEST).send("El nombre debe tener al menos 3 letras");

    const client = new Client(config);
    try {
        await client.connect();
        const result = await client.query('UPDATE alumnos SET nombre=$1, apellido=$2, id_curso=$3, fecha_nacimiento=$4, hace_deportes=$5 WHERE id=$6',
            [nombre, apellido, id_curso, fecha_nacimiento, hace_deportes, id]);

        if (result.rowCount === 0)
            return res.status(StatusCodes.NOT_FOUND).send("Alumno no encontrado");

        res.status(StatusCodes.CREATED).send("Alumno actualizado");
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: error.message });
    } finally {
        await client.end();
    }
});

// DELETE /api/alumnos/:id
app.delete('/api/alumnos/:id', async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) return res.status(StatusCodes.BAD_REQUEST).send("ID inválido");

    const client = new Client(config);
    try {
        await client.connect();
        const result = await client.query('DELETE FROM alumnos WHERE id=$1', [id]);
        if (result.rowCount === 0)
            return res.status(StatusCodes.NOT_FOUND).send("Alumno no encontrado");

        res.status(StatusCodes.OK).send("Alumno eliminado");
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: error.message });
    } finally {
        await client.end();
    }
});

// Escuchar en el puerto
app.listen(port, () => {
    console.log(`Servidor escuchando en http://localhost:${port}`);
});
