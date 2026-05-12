const express = require('express');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());

let todos = [];

app.get('/api/todos', (req, res) => {
  res.json(todos);
});

app.post('/api/todos', (req, res) => {
  const todo = {
    id: String(Date.now()),
    text: req.body.text,
  };

  todos.push(todo);

  res.status(201).json(todo);
});

app.listen(80, () => {
  console.log('API listening on port 80');
});