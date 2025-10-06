import { useEffect, useMemo, useState } from 'react';
import TodoItem from './TodoItem.jsx';

const STORAGE_KEY = 'todos-v1';

function loadTodos() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveTodos(todos) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
}

export default function App() {
  const [todos, setTodos] = useState(() => loadTodos());
  const [text, setText] = useState('');
  const [filter, setFilter] = useState('all'); // 'all' | 'active' | 'completed'

  useEffect(() => {
    saveTodos(todos);
  }, [todos]);

  const addTodo = (e) => {
    e.preventDefault();
    const t = text.trim();
    if (!t) return;
    const id =
      typeof crypto !== 'undefined' && crypto.randomUUID
        ? crypto.randomUUID()
        : String(Date.now() + Math.random());
    setTodos((prev) => [...prev, { id, text: t, completed: false }]);
    setText('');
  };

  const toggleTodo = (id) =>
    setTodos((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t)),
    );

  const deleteTodo = (id) =>
    setTodos((prev) => prev.filter((t) => t.id !== id));

  const editTodo = (id, newText) =>
    setTodos((prev) =>
      prev.map((t) => (t.id === id ? { ...t, text: newText } : t)),
    );

  const clearCompleted = () =>
    setTodos((prev) => prev.filter((t) => !t.completed));

  const remaining = todos.filter((t) => !t.completed).length;

  const filteredTodos = useMemo(() => {
    switch (filter) {
      case 'active':
        return todos.filter((t) => !t.completed);
      case 'completed':
        return todos.filter((t) => t.completed);
      default:
        return todos;
    }
  }, [todos, filter]);

  return (
    <div className="container">
      <header className="header">
        <h1>Todo</h1>
        <p className="subtle">{remaining} item{remaining !== 1 ? 's' : ''} left</p>
      </header>

      <form onSubmit={addTodo} className="add-form" aria-label="Add todo form">
        <input
          className="input"
          type="text"
          placeholder="What needs to be done?"
          value={text}
          onChange={(e) => setText(e.target.value)}
          aria-label="New todo"
        />
        <button className="btn primary" type="submit" disabled={!text.trim()}>
          Add
        </button>
      </form>

      <div className="filters" role="tablist" aria-label="Filter todos">
        <button
          className={`chip ${filter === 'all' ? 'active' : ''}`}
          onClick={() => setFilter('all')}
          role="tab"
          aria-selected={filter === 'all'}
        >
          All
        </button>
        <button
          className={`chip ${filter === 'active' ? 'active' : ''}`}
          onClick={() => setFilter('active')}
          role="tab"
          aria-selected={filter === 'active'}
        >
          Active
        </button>
        <button
          className={`chip ${filter === 'completed' ? 'active' : ''}`}
          onClick={() => setFilter('completed')}
          role="tab"
          aria-selected={filter === 'completed'}
        >
          Completed
        </button>

        <div className="spacer" />
        <button className="btn subtle" onClick={clearCompleted}>
          Clear completed
        </button>
      </div>

      <ul className="list" aria-live="polite">
        {filteredTodos.length === 0 ? (
          <li className="empty">No todos to show.</li>
        ) : (
          filteredTodos.map((todo) => (
            <TodoItem
              key={todo.id}
              todo={todo}
              onToggle={toggleTodo}
              onDelete={deleteTodo}
              onEdit={editTodo}
            />
          ))
        )}
      </ul>

      <footer className="footer">
        <small className="subtle">
          Data is stored locally in your browser (localStorage).
        </small>
      </footer>
    </div>
  );
}
