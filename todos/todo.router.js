const express = require("express");
// const { route } = require("../todos");

const router = express.Router();

// temp data to mimic database
const todos = {};

router
  .route("/")
  .get((req, res) => {
    console.log(req.query);
    res.send({ data: todos[req.query.username] });
  })
  .post((req, res) => {
    const userTodos = todos[req.body.user];
    const todo = {
      title: req.body.todo.title,
      body: req.body.todo.body,
    };
    if (userTodos) {
      todos[req.body.user].push(todo);
    } else {
      todos[req.body.user] = [todo];
    }
    res.status(201).send({ data: todo });
  });

router.route("/:id").get().put().delete();

module.exports = router;
