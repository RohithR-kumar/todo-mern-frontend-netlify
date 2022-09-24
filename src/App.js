import { useState } from "react";
import { useEffect } from "react";
import "./App.css";

const heroku_url = process.env.HEROKU_URL || "http://localhost:5000/api/";

function App() {
  const [todos, setTodos] = useState([]);
  const [title, setTitle] = useState("");
  const [currentId, setCurrentId] = useState("");

  const handleEdit = (todo) => {
    setTitle(todo.title);
    setCurrentId(todo._id);
  };

  useEffect(() => {
    const app = async () => {
      const response = await fetch(heroku_url + "todos", {
        method: "GET",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      const newData = data.map((todo) => {
        return { ...todo, edit: false };
      });
      setTodos((prevVaule) => newData);
      console.log(todos);
    };
    app();
  }, [currentId]);

  const handlePostSubmit = async (title) => {
    let url;
    let method;
    if (currentId === "") {
      url = heroku_url + "todos";
      method = "POST";
    } else {
      url = heroku_url + `todos/${currentId}`;
      method = "PUT";
    }
    const response = await fetch(url, {
      method: method,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ title: title }),
    });
    const data = await response.json();
    setTodos((prevVaule) => [...todos, data]);
  };

  const handleDelete = async (_id) => {
    const response = await fetch(heroku_url + `todos/${_id}`, {
      method: "DELETE",
    });
    const data = await response.json();
    const newTodos = todos.filter((todo) => todo._id !== _id);
    setTodos((prevVaule) => newTodos);
  };
  return (
    <div>
      <form onSubmit={() => handlePostSubmit(title)}>
        <input value={title} onChange={(e) => setTitle(e.target.value)} />
        <input type="submit" />
      </form>
      {todos.map((todo) => (
        <div key={todo._id}>
          <h3>{todo.title}</h3>
          <button onClick={() => handleEdit(todo)}>Edit</button>
          <button onClick={() => handleDelete(todo._id)}>Delete</button>
        </div>
      ))}
    </div>
  );
}

export default App;
