const crudControllers = require("../utils/crud");
const Todo = require("./todo.model");

module.exports = crudControllers(Todo);
