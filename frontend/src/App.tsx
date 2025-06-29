import React, { useEffect, useState } from 'react';
import './App.css';

type Todo = {
  _id: string;
  title: string;
  done: boolean;
};

const API_URL = process.env.REACT_APP_API_URL + '/todos';

function App() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [title, setTitle] = useState('');
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    try {
      const res = await fetch(API_URL);
      const data = await res.json();
      setTodos(data);
    } catch (error) {
      console.error('Failed to fetch todos:', error);
    }
  };

  const addTodo = async () => {
    if (!title.trim()) return;
    try {
      await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: title.trim() }),
      });
      setTitle('');
      fetchTodos();
    } catch (error) {
      console.error('Failed to add todo:', error);
    }
  };

  const toggleTodo = async (id: string, done: boolean) => {
    try {
      await fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ done: !done }),
      });
      fetchTodos();
    } catch (error) {
      console.error('Failed to update todo:', error);
    }
  };

  const deleteTodo = async (id: string) => {
    try {
      await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
      fetchTodos();
    } catch (error) {
      console.error('Failed to delete todo:', error);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      addTodo();
    }
  };

  const filteredTodos = todos.filter(todo => {
    if (filter === 'active') return !todo.done;
    if (filter === 'completed') return todo.done;
    return true;
  });

  const completedCount = todos.filter(todo => todo.done).length;
  const activeCount = todos.length - completedCount;

  return (
    <div className="app">
      <div className="container">
        <header className="header">
          <h1 className="title">
            <span className="icon">✨</span>
            My Todo App 
          </h1>
          <p className="subtitle">シンプルで美しいタスク管理</p>
        </header>

        <div className="add-todo">
          <div className="input-group">
            <input
              className="todo-input"
              value={title}
              onChange={e => setTitle(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="新しいタスクを入力..."
              maxLength={100}
            />
            <button 
              className="add-button" 
              onClick={addTodo}
              disabled={!title.trim()}
            >
              <span className="add-icon">+</span>
              追加
            </button>
          </div>
        </div>

        <div className="filters">
          <button 
            className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
            onClick={() => setFilter('all')}
          >
            すべて ({todos.length})
          </button>
          <button 
            className={`filter-btn ${filter === 'active' ? 'active' : ''}`}
            onClick={() => setFilter('active')}
          >
            進行中 ({activeCount})
          </button>
          <button 
            className={`filter-btn ${filter === 'completed' ? 'active' : ''}`}
            onClick={() => setFilter('completed')}
          >
            完了 ({completedCount})
          </button>
        </div>

        <div className="todo-list">
          {filteredTodos.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">📝</div>
              <p className="empty-text">
                {filter === 'all' && 'タスクがありません。新しいタスクを追加してみましょう！'}
                {filter === 'active' && '進行中のタスクはありません。素晴らしい！'}
                {filter === 'completed' && '完了したタスクはありません。'}
              </p>
            </div>
          ) : (
            filteredTodos.map(todo => (
              <div key={todo._id} className={`todo-item ${todo.done ? 'completed' : ''}`}>
                <label className="todo-label">
                  <input
                    type="checkbox"
                    className="todo-checkbox"
                    checked={todo.done}
                    onChange={() => toggleTodo(todo._id, todo.done)}
                  />
                  <span className="checkmark"></span>
                  <span className="todo-text">{todo.title}</span>
                </label>
                <button 
                  className="delete-button"
                  onClick={() => deleteTodo(todo._id)}
                  aria-label="タスクを削除"
                >
                  <span className="delete-icon">🗑️</span>
                </button>
              </div>
            ))
          )}
        </div>

        {todos.length > 0 && (
          <footer className="footer">
            <div className="stats">
              <span className="stat">
                {activeCount > 0 ? `${activeCount}個のタスクが残っています` : 'すべてのタスクが完了しました！🎉'}
              </span>
            </div>
          </footer>
        )}
      </div>
    </div>
  );
}

export default App;
