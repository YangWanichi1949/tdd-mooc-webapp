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
      text TEXT NOT NULL,
      completed BOOLEAN NOT NULL DEFAULT FALSE
    )
  `);

  await pool.query(`
    ALTER TABLE todos
    ADD COLUMN IF NOT EXISTS completed BOOLEAN NOT NULL DEFAULT FALSE
  `);
}

app.get('/api/todos', async (req, res) => {
  const result = await pool.query(
    'SELECT id, text, completed FROM todos ORDER BY id'
  );

  res.json(
    result.rows.map((todo) => ({
      id: String(todo.id),
      text: todo.text,
      completed: todo.completed,
    }))
  );
});

app.post('/api/todos', async (req, res) => {
  const result = await pool.query(
    'INSERT INTO todos (text) VALUES ($1) RETURNING id, text, completed',
    [req.body.text]
  );

  const todo = result.rows[0];

  res.status(201).json({
    id: String(todo.id),
    text: todo.text,
    completed: todo.completed,
  });
});

app.put('/api/todos/:id', async (req, res) => {
  const result = await pool.query(
    'UPDATE todos SET completed = $1 WHERE id = $2 RETURNING id, text, completed',
    [req.body.completed, req.params.id]
  );

  const todo = result.rows[0];

  res.json({
    id: String(todo.id),
    text: todo.text,
    completed: todo.completed,
  });
});

app.put('/api/todos/:id/text', async (req, res) => {
  const result = await pool.query(
    'UPDATE todos SET text = $1 WHERE id = $2 RETURNING id, text, completed',
    [req.body.text, req.params.id]
  );

  const todo = result.rows[0];

  res.json({
    id: String(todo.id),
    text: todo.text,
    completed: todo.completed,
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