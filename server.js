const express = require("express");
const cors = require("cors");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

let tasks = [
  {
    id: 1,
    title: "Setup AWS EC2 Server",
    status: "completed",
    priority: "high",
    createdAt: new Date().toISOString()
  },
  {
    id: 2,
    title: "Install Jenkins and Docker",
    status: "completed",
    priority: "high",
    createdAt: new Date().toISOString()
  },
  {
    id: 3,
    title: "Deploy Dynamic Express App",
    status: "pending",
    priority: "medium",
    createdAt: new Date().toISOString()
  }
];

let nextId = 4;

app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    app: "Dynamic Backend Dashboard",
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
});

app.get("/api/tasks", (req, res) => {
  res.json({
    success: true,
    data: tasks
  });
});

app.post("/api/tasks", (req, res) => {
  const { title, priority } = req.body;

  if (!title || title.trim() === "") {
    return res.status(400).json({
      success: false,
      message: "Task title is required"
    });
  }

  const newTask = {
    id: nextId++,
    title: title.trim(),
    status: "pending",
    priority: priority || "medium",
    createdAt: new Date().toISOString()
  };

  tasks.unshift(newTask);

  res.status(201).json({
    success: true,
    message: "Task created successfully",
    data: newTask
  });
});

app.patch("/api/tasks/:id/toggle", (req, res) => {
  const taskId = Number(req.params.id);
  const task = tasks.find((item) => item.id === taskId);

  if (!task) {
    return res.status(404).json({
      success: false,
      message: "Task not found"
    });
  }

  task.status = task.status === "completed" ? "pending" : "completed";

  res.json({
    success: true,
    message: "Task status updated",
    data: task
  });
});

app.delete("/api/tasks/:id", (req, res) => {
  const taskId = Number(req.params.id);
  const existingLength = tasks.length;

  tasks = tasks.filter((item) => item.id !== taskId);

  if (tasks.length === existingLength) {
    return res.status(404).json({
      success: false,
      message: "Task not found"
    });
  }

  res.json({
    success: true,
    message: "Task deleted successfully"
  });
});

app.get("/api/stats", (req, res) => {
  const total = tasks.length;
  const completed = tasks.filter((task) => task.status === "completed").length;
  const pending = total - completed;

  res.json({
    success: true,
    data: {
      total,
      completed,
      pending,
      deployment: "AWS EC2 + Jenkins + Docker",
      version: "1.0.0"
    }
  });
});

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Dynamic backend dashboard running on port ${PORT}`);
});