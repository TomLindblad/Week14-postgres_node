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
        const result = await pool.query(`
            SELECT players.name, games.title, scores.score 
            FROM scores 
            JOIN games ON games.id = game_id 
            JOIN players ON players.id = player_id
            `)
        res.json(result.rows);
    } catch (error) {
        res.status(500).send(error);
    }
});

app.get("/top_players", async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT players.name, SUM(scores.score) AS highscore 
            FROM players 
            JOIN scores ON players.id = scores.player_id 
            GROUP BY players.name 
            ORDER BY highscore DESC 
            LIMIT 3
            `)
        res.json(result.rows);
    } catch (error) {
        res.status(500).send(error);
    }
})

app.get("/inactive_players", async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT players.name
            FROM players
            LEFT OUTER JOIN scores ON players.id = player_id
            WHERE scores.score IS NULL
            `)
        res.json(result.rows);
    } catch (error) {
        res.status(500).send(error);
    }
})

app.get("/popular_genres", async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT games.genre, COUNT(scores.game_id) AS times_played  
            FROM scores 
            JOIN games ON scores.game_id = games.id 
            GROUP BY games.genre
            ORDER BY times_played DESC
            `)
        res.json(result.rows);
    } catch (error) {
        res.status(500).send(error);
    }
});

app.get("/recent_players", async (req, res) => {
    try { 
        const result = await pool.query(`
            SELECT name, join_date
            FROM players
            WHERE join_date > CURRENT_TIMESTAMP - INTERVAL '30 DAY'
            `)
        res.json(result.rows);
    } catch (error) {
        res.status(500).send(error);
    }
})

app.listen(3000, (req, res) => {
    console.log("Server is up and runnin' on port: 3000!")
})