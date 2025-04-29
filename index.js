import express from "express";
import pg from "pg";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const { Pool } = pg;

const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_DATABASE,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
});

app.get("/players_scores", async (req, res) => {
    try {
        const result = await pool.query("SELECT players.name, games.title, scores.score FROM scores JOIN games ON games.id = game_id JOIN players ON players.id = player_id")
        res.json(result.rows);
    } catch (error) {
        res.status(500).send(error);
    }
})

app.listen(3000, (req, res) => {
    console.log("Server is up and runnin' on port: 3000!")
})