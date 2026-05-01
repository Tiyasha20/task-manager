const cors = require("cors");
const express = require("express");
const path = require("path");
const authRoutes = require("./routes/authRoutes");
const taskRoutes = require("./routes/taskRoutes");

const app = express();

app.use(cors());
app.use(express.json());

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/dist")));
}

app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);

if (process.env.NODE_ENV === "production") {
  app.get("*", (req, res) => {
    if (req.path.startsWith("/api")) {
      return res.status(404).json({ message: "Route not found" });
    }
    res.sendFile(path.join(__dirname, "../frontend/dist/index.html"));
  });
} else {
  app.use((req, res) => {
    res.status(404).json({ message: "Route not found" });
  });
}

app.use((error, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode).json({
    message: error.message || "Server error",
  });
});

module.exports = app;
