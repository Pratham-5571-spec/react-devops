import { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [todos, setTodos] = useState([]);
  const [title, setTitle] = useState("");

  const fetchTodos = async () => {
    const res = await axios.get("http://localhost:5000/todos");
    setTodos(res.data);
  };

  const addTodo = async () => {
    if (!title.trim()) return;

    await axios.post("http://localhost:5000/todos", {
      title,
      completed: false
    });

    setTitle("");
    fetchTodos();
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  return (
    <div className="container">
      <div className="card">
        <h1>🚀 My  List</h1>

        <div className="input-group">
          <input
            value={title}
            placeholder="Enter a task..."
            onChange={(e) => setTitle(e.target.value)}
          />
          <button onClick={addTodo}>Add</button>
        </div>

        <div className="todo-list">
          {todos.length === 0 && (
            <p className="empty">No tasks yet. Add one!</p>
          )}

          {todos.map((t) => (
            <div className="todo-item" key={t._id}>
              <span>{t.title}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;