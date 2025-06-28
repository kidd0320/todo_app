import React, { useEffect, useState } from 'react';

type Todo = {
  _id: string;
  title: string;
  done: boolean;
};

const API_URL = 'http://localhost:3000/todos';

function App() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [title, setTitle] = useState('');

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    const res = await fetch(API_URL);
    const data = await res.json();
    setTodos(data);
  };

  const addTodo = async () => {
    if (!title) return;
    await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title }),
    });
    setTitle('');
    fetchTodos();
  };

  const toggleTodo = async (id: string, done: boolean) => {
    await fetch(`${API_URL}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ done: !done }),
    });
    fetchTodos();
  };

  const deleteTodo = async (id: string) => {
    await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
    fetchTodos();
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>📝 TODO</h1>
      <input
        value={title}
        onChange={e => setTitle(e.target.value)}
        placeholder="新しいタスク"
      />
      <button onClick={addTodo}>追加</button>

      <ul>
        {todos.map(todo => (
          <li key={todo._id}>
            <label style={{ textDecoration: todo.done ? 'line-through' : 'none' }}>
              <input
                type="checkbox"
                checked={todo.done}
                onChange={() => toggleTodo(todo._id, todo.done)}
              />
              {todo.title}
            </label>
            <button onClick={() => deleteTodo(todo._id)}>🗑</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
