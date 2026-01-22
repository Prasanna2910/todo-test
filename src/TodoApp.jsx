import React from 'react';
import './TodoApp.css';

export function TodoApp() {
  const [todos, setTodos] = React.useState([]);
  const [input, setInput] = React.useState('');
  const [filter, setFilter] = React.useState('all');

  const addTodo = () => {
    if (input.trim()) {
      setTodos([...todos, { id: Date.now(), text: input, completed: false }]);
      setInput('');
    }
  };

  const deleteTodo = (id) => {
    setTodos(todos.filter((todo) => todo.id !== id));
  };

  const toggleTodo = (id) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  const clearCompleted = () => {
    setTodos(todos.filter((todo) => !todo.completed));
  };

  const filteredTodos = todos.filter((todo) => {
    if (filter === 'completed') return todo.completed;
    if (filter === 'active') return !todo.completed;
    return true;
  });

  const activeCount = todos.filter((todo) => !todo.completed).length;
  const completedCount = todos.filter((todo) => todo.completed).length;

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      addTodo();
    }
  };

  return (
    <div className="todo-app">
      <div className="todo-container">
        <h1 className="app-title">✓ My Todo List</h1>

        <div className="input-section">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Add a new todo..."
            className="todo-input"
            data-testid="todo-input"
          />
          <button onClick={addTodo} className="add-btn" data-testid="add-btn">
            Add
          </button>
        </div>

        <div className="stats-section">
          <div className="stat">
            <span className="stat-label">Total:</span>
            <span className="stat-value" data-testid="total-count">
              {todos.length}
            </span>
          </div>
          <div className="stat">
            <span className="stat-label">Active:</span>
            <span className="stat-value active" data-testid="active-count">
              {activeCount}
            </span>
          </div>
          <div className="stat">
            <span className="stat-label">Completed:</span>
            <span className="stat-value completed" data-testid="completed-count">
              {completedCount}
            </span>
          </div>
        </div>

        <div className="filter-section">
          <button
            className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
            onClick={() => setFilter('all')}
            data-testid="filter-all"
          >
            All
          </button>
          <button
            className={`filter-btn ${filter === 'active' ? 'active' : ''}`}
            onClick={() => setFilter('active')}
            data-testid="filter-active"
          >
            Active
          </button>
          <button
            className={`filter-btn ${filter === 'completed' ? 'active' : ''}`}
            onClick={() => setFilter('completed')}
            data-testid="filter-completed"
          >
            Completed
          </button>
        </div>

        <div className="todos-section">
          {filteredTodos.length === 0 ? (
            <div className="empty-state" data-testid="empty-state">
              {todos.length === 0
                ? 'No todos yet. Add one to get started!'
                : `No ${filter} todos`}
            </div>
          ) : (
            <ul className="todos-list">
              {filteredTodos.map((todo) => (
                <li
                  key={todo.id}
                  className={`todo-item ${todo.completed ? 'completed' : ''}`}
                  data-testid={`todo-item-${todo.id}`}
                >
                  <input
                    type="checkbox"
                    checked={todo.completed}
                    onChange={() => toggleTodo(todo.id)}
                    className="todo-checkbox"
                    data-testid={`checkbox-${todo.id}`}
                  />
                  <span className="todo-text">{todo.text}</span>
                  <button
                    onClick={() => deleteTodo(todo.id)}
                    className="delete-btn"
                    data-testid={`delete-btn-${todo.id}`}
                  >
                    ✕
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {completedCount > 0 && (
          <button
            onClick={clearCompleted}
            className="clear-btn"
            data-testid="clear-completed-btn"
          >
            Clear Completed ({completedCount})
          </button>
        )}
      </div>
    </div>
  );
}

export default TodoApp;
