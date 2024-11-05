// server.js
import express from "express";
import next from "next";
import cors from "cors";

const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

let todos = [];
let idCounter = 1;
let commentCounter = 1;

app.prepare().then(() => {
  const server = express();

  server.use(express.json()); // For JSON request body parsing
  server.use(cors());
  // Define your Express routes for the to-do app
  server.get("/api/todos", (req, res) => {
    console.log("getting todos");
    res.json(todos);
  });

  server.post("/api/todos", (req, res) => {
    const { title, completed = false, comment = { text: "" } } = req.body;
    const newTodo = {
      id: idCounter++,
      title,
      completed,
      comment: {
        id: commentCounter++,
        text: comment.text,
      },
    };
    todos.push(newTodo);
    res.status(201).json(newTodo);
  });

  server.put("/api/todos/:id", (req, res) => {
    const id = parseInt(req.params.id);
    const todo = todos.find((todo) => todo.id === id);
    if (!todo) return res.status(404).json({ error: "Todo not found" });
    todo.title = req.body.title || todo.title;
    todo.completed = req.body.completed ?? todo.completed;

    if (req.body.comment) {
      todo.comment.text = req.body.comment.text || todo.comment.text;
    }

    res.json(todo);
  });

  server.get("/api/todos/:id", (req, res) => {
    const id = parseInt(req.params.id);
    const todo = todos.find((todo) => todo.id === id);
    if (!todo) return res.status(404).json({ error: "Todo not found" });
    res.json(todo);
  });

  server.delete("/api/todos/:id", (req, res) => {
    todos = todos.filter((todo) => todo.id !== parseInt(req.params.id));
    res.status(204).send();
  });

  // Handle all other requests by Next.js
  server.all("*", (req, res) => {
    return handle(req, res);
  });

  server.listen(3001, (err) => {
    if (err) throw err;
    console.log("> Ready on http://localhost:3000");
  });
});
