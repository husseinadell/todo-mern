const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");
const connectDB = require("./config/db");
const todoRouter = require("./todos/todo.router");
const { authRouter, protect } = require("./user/user.auth");

// loading env variables from .env configs
dotenv.config({ path: "./config/config.env" });

// init db connection
connectDB();

const app = express();
// Middleware
app.use(express.json());

// dev setup
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// Auth middleware
app.use("/api/users", authRouter);
app.use(protect);

// REST APIs Routers
app.use("/api/todos", todoRouter);
// production setup with static files
if (process.env.NODE_ENV === "production") {
  app.use(express.static("client/build"));

  app.get("*", (req, res) =>
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"))
  );
}

app.get("/users", (req, res) => {
  res.json(users);
});

const PORT = process.env.PORT || 3000;

app.listen(
  PORT,
  console.log(
    `Server is running on ${process.env.NODE_ENV} mode on http://localhost:${PORT}`
  )
);
