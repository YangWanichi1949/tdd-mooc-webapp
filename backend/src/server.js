const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();

app.use(cors());
app.use(express.json());

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

async function initializeDatabase() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS todos (
      id SERIAL PRIMARY KEY,
      text TEXT NOT NULL
    )
  `);
}

app.get('/api/todos', async (req, res) => {
  const result = await pool.query(
    'SELECT id, text FROM todos ORDER BY id'
  );

  res.json(
    result.rows.map((todo) => ({
      id: String(todo.id),
      text: todo.text,
    }))
  );
});

app.post('/api/todos', async (req, res) => {
  const result = await pool.query(
    'INSERT INTO todos (text) VALUES ($1) RETURNING id, text',
    [req.body.text]
  );

  const todo = result.rows[0];

  res.status(201).json({
    id: String(todo.id),
    text: todo.text,
  });
});

async function startServer() {
  for (let attempt = 1; attempt <= 10; attempt++) {
    try {
      await initializeDatabase();

      app.listen(80, () => {
        console.log('API listening on port 80');
      });

      return;
    } catch (error) {
      console.log(`Database not ready, retrying ${attempt}/10`);
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
  }

  throw new Error('Could not connect to database');
}

startServer();