import express from "express"
import cors from "cors"
import config from './src/configs/db-config.js'
import pkg from 'pg'
import { StatusCodes } from 'http-status-codes'

const { Client } = pkg
const app = express()
const port = 3000

app.use(cors())
app.use(express.json())

// ENDPOINTS

app.get('/api/alumnos', async (req, res) => {
    const client = new Client(config)
    try {
        await client.connect()
        const result = await client.query("SELECT * FROM alumnos")
        res.status(StatusCodes.OK).json(result.rows)
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: error.message })
    } finally {
        await client.end()
    }
})

app.get('/api/alumnos/:id', async (req, res) => {
    const { id } = req.params
    if (isNaN(id)) return res.status(StatusCodes.BAD_REQUEST).send("ID inválido")
    const client = new Client(config)
    try {
        await client.connect()
        const result = await client.query("SELECT * FROM alumnos WHERE id = $1", [id])
        if (result.rowCount === 0)
            return res.status(StatusCodes.NOT_FOUND).send("No encontrado")
        res.status(StatusCodes.OK).json(result.rows[0])
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: error.message })
    } finally {
        await client.end()
    }
})

app.post('/api/alumnos', async (req, res) => {
    const { nombre, apellido, id_curso, fecha_nacimiento, hace_deportes } = req.body
    if (!nombre || nombre.length < 3)
        return res.status(StatusCodes.BAD_REQUEST).send("Nombre inválido")
    const client = new Client(config)
    try {
        await client.connect()
        const query = `
            INSERT INTO alumnos (nombre, apellido, id_curso, fecha_nacimiento, hace_deportes)
            VALUES ($1, $2, $3, $4, $5)`
        await client.query(query, [nombre, apellido, id_curso, fecha_nacimiento, hace_deportes])
        res.status(StatusCodes.CREATED).send("Alumno creado")
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: error.message })
    } finally {
        await client.end()
    }
})

app.put('/api/alumnos', async (req, res) => {
    const { id, nombre, apellido, id_curso, fecha_nacimiento, hace_deportes } = req.body
    if (!nombre || nombre.length < 3)
        return res.status(StatusCodes.BAD_REQUEST).send("Nombre inválido")
    const client = new Client(config)
    try {
        await client.connect()
        const result = await client.query("SELECT * FROM alumnos WHERE id = $1", [id])
        if (result.rowCount === 0)
            return res.status(StatusCodes.NOT_FOUND).send("No encontrado")
        const update = `
            UPDATE alumnos SET nombre=$1, apellido=$2, id_curso=$3,
            fecha_nacimiento=$4, hace_deportes=$5 WHERE id=$6`
        await client.query(update, [nombre, apellido, id_curso, fecha_nacimiento, hace_deportes, id])
        res.status(StatusCodes.CREATED).send("Alumno actualizado")
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: error.message })
    } finally {
        await client.end()
    }
})

app.delete('/api/alumnos/:id', async (req, res) => {
    const { id } = req.params
    const client = new Client(config)
    try {
        await client.connect()
        const result = await client.query("DELETE FROM alumnos WHERE id = $1", [id])
        if (result.rowCount === 0)
            return res.status(StatusCodes.NOT_FOUND).send("No encontrado")
        res.status(StatusCodes.OK).send("Alumno eliminado")
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: error.message })
    } finally {
        await client.end()
    }
})

// Iniciar servidor
app.listen(port, () => {
    console.log(`Servidor escuchando en http://localhost:${port}`)
})
