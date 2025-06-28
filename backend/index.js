const express = require('express');
const cors = require('cors');
const { MongoClient, ObjectId } = require('mongodb');

const app = express();
const PORT = 3000;

const mongoUrl = process.env.MONGO_URL || 'mongodb://localhost:27017/todo-app';

app.use(cors());            // ← CORSミドルウェアを先に適用
app.use(express.json());   // ← JSONパーサー

let db;

// MongoDBに接続
MongoClient.connect(mongoUrl, { useUnifiedTopology: true })
  .then(client => {
    db = client.db();
    console.log('✅ Connected to MongoDB');
  })
  .catch(err => {
    console.error('❌ Failed to connect to MongoDB', err);
  });

// TODO一覧取得
app.get('/todos', async (req, res) => {
  const todos = await db.collection('todos').find().toArray();
  res.json(todos);
});

// TODO追加
app.post('/todos', async (req, res) => {
  const { title } = req.body;
  if (!title) return res.status(400).send('title is required');

  const result = await db.collection('todos').insertOne({ title, done: false });
  res.status(201).json({ id: result.insertedId, title, done: false });
});

// TODO完了状態更新
app.put('/todos/:id', async (req, res) => {
  const { id } = req.params;
  const { done } = req.body;
  if (typeof done !== 'boolean') return res.status(400).send('done must be boolean');

  await db.collection('todos').updateOne(
    { _id: new ObjectId(id) },
    { $set: { done } }
  );
  res.sendStatus(204);
});

// TODO削除
app.delete('/todos/:id', async (req, res) => {
  const { id } = req.params;
  await db.collection('todos').deleteOne({ _id: new ObjectId(id) });
  res.sendStatus(204);
});

app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});
