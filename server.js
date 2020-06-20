const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");
const cors = require("cors");
const connectDB = require("./config/db");
const todoRouter = require("./todos/todo.router");
const userRouter = require("./user/user.router");
const { authRouter, protect } = require("./user/user.auth");

// loading env variables from .env configs
dotenv.config({ path: "./config/config.env" });

const app = express();

// Middlewares
app.use(express.json());
app.use(cors());

// dev setup
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// Auth router
app.use("/users", authRouter);

// REST APIs Routers and protect middleware
app.use("/api", protect);
app.use("/api/todo", todoRouter);
app.use("/api/user", userRouter);

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

const start = async () => {
  try {
    const PORT = process.env.PORT || 3000;
    await connectDB();
    app.listen(PORT, () => {
      console.log(
        `REST API on ${process.env.NODE_ENV} http://localhost:${PORT}/api`
      );
    });
  } catch (error) {
    console.error(error);
  }
};

module.exports = start;
