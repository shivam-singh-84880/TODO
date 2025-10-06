import { useState } from 'react';

export default function TodoItem({ todo, onToggle, onDelete, onEdit }) {
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState(todo.text);

  const submitEdit = (e) => {
    e?.preventDefault?.();
    const t = draft.trim();
    if (t && t !== todo.text) onEdit(todo.id, t);
    setIsEditing(false);
  };

  const cancelEdit = () => {
    setDraft(todo.text);
    setIsEditing(false);
  };

  return (
    <li className="todo">
      <label className="checkbox">
        <input
          type="checkbox"
          checked={todo.completed}
          onChange={() => onToggle(todo.id)}
          aria-label={
            todo.completed
              ? `Mark "${todo.text}" as active`
              : `Mark "${todo.text}" as completed`
          }
        />
        <span className="checkmark" />
      </label>

      {isEditing ? (
        <form className="edit-form" onSubmit={submitEdit}>
          <input
            className="edit-input"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            autoFocus
            onBlur={submitEdit}
            onKeyDown={(e) => {
              if (e.key === 'Escape') cancelEdit();
            }}
            aria-label={`Edit ${todo.text}`}
          />
        </form>
      ) : (
        <button
          className={`text-btn ${todo.completed ? 'completed' : ''}`}
          title="Click to edit"
          onClick={() => setIsEditing(true)}
        >
          {todo.text}
        </button>
      )}

      <button
        className="delete-btn"
        onClick={() => onDelete(todo.id)}
        aria-label={`Delete "${todo.text}"`}
        title="Delete"
      >
        ×
      </button>
    </li>
  )};
