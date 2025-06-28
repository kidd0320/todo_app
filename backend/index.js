const express = require('express');
const { MongoClient } = require('mongodb');

const app = express();
const PORT = 3000;

const mongoUrl = process.env.MONGO_URL || 'mongodb://localhost:27017/todo-app';

app.use(express.json());

let db;

MongoClient.connect(mongoUrl, { useUnifiedTopology: true })
  .then(client => {
    db = client.db();
    console.log('✅ Connected to MongoDB');
  })
  .catch(err => {
    console.error('❌ Failed to connect to MongoDB', err);
  });

// POST /todos { title: "タスク" }
app.post('/todos', async (req, res) => {
  const { title } = req.body;
  if (!title) return res.status(400).send('title is required');
  const result = await db.collection('todos').insertOne({ title });
  res.json({ id: result.insertedId, title });
});

// GET /todos
app.get('/todos', async (req, res) => {
  const todos = await db.collection('todos').find().toArray();
  res.json(todos);
});

app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});
