import React, { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";
const App = () => {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState("");
  const [editTodo, setEditTodo] = useState(null);
  const [editedTitle, setEditedTitle] = useState("");

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    try {
      const response = await axios.get("http://localhost:5000/todos");
      setTodos(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const addTodo = async () => {
    if (newTodo.trim() === "") {
      return;
    }

    try {
      const response = await axios.post("http://localhost:5000/todos", {
        title: newTodo,
      });
      const newTodoId = response.data;
      setTodos((prevTodos) => [
        ...prevTodos,
        { id: newTodoId, title: newTodo, completed: false },
      ]);
      setNewTodo("");
    } catch (error) {
      console.log(error);
    }
  };

  const deleteTodo = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/todos/${id}`);
      setTodos((prevTodos) => prevTodos.filter((todo) => todo.id !== id));
    } catch (error) {
      console.log(error);
    }
  };

  const updateTodo = async (id, completed) => {
    try {
      await axios.put(`http://localhost:5000/todos/${id}`, {
        completed: !completed,
      });
      setTodos((prevTodos) =>
        prevTodos.map((todo) => {
          if (todo.id === id) {
            return { ...todo, completed: !completed };
          }
          return todo;
        })
      );
    } catch (error) {
      console.log(error);
    }
  };

  const startEdit = (id, title) => {
    setEditTodo(id);
    setEditedTitle(title);
  };

  const cancelEdit = () => {
    setEditTodo(null);
    setEditedTitle("");
  };

  const saveEdit = async (id) => {
    try {
      await axios.put(`http://localhost:5000/todos/${id}`, {
        title: editedTitle,
        completed: todos.find((todo) => todo.id === id).completed,
      });
      setTodos((prevTodos) =>
        prevTodos.map((todo) => {
          if (todo.id === id) {
            return { ...todo, title: editedTitle };
          }
          return todo;
        })
      );
      setEditTodo(null);
      setEditedTitle("");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <h1>Todo List</h1>
      <div className="control-div">
        <input
          type="text"
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
        />
        <button onClick={addTodo}>Add</button>
      </div>
      <ul>
        {todos.map((todo) => (
          <li key={todo.id}>
            {editTodo === todo.id ? (
              <>
                <input
                  type="text"
                  value={editedTitle}
                  onChange={(e) => setEditedTitle(e.target.value)}
                  onBlur={() => saveEdit(todo.id)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      saveEdit(todo.id);
                    } else if (e.key === "Escape") {
                      cancelEdit();
                    }
                  }}
                />

                <button onClick={() => saveEdit(todo.id)}>Save</button>
                <button onClick={cancelEdit}>Cancel</button>
              </>
            ) : (
              <>
                <div className="ct-div">
                  <span
                    style={{
                      textDecoration: todo.completed ? "line-through" : "none",
                    }}
                  >
                    {todo.title}
                  </span>
                  <button onClick={() => deleteTodo(todo.id)}>Delete</button>
                  <button onClick={() => updateTodo(todo.id, todo.completed)}>
                    {todo.completed ? "Mark Incomplete" : "Mark Complete"}
                  </button>
                  <button onClick={() => startEdit(todo.id, todo.title)}>
                    Edit
                  </button>
                </div>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default App;
