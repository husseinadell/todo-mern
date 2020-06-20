const { Router } = require("express");
const controllers = require("./todo.controllers");
const router = Router();

// /api/todo
router.route("/").get(controllers.getMany).post(controllers.createOne);

// /api/todo/:id
router
  .route("/:id")
  .get(controllers.getOne)
  .put(controllers.updateOne)
  .delete(controllers.removeOne);

module.exports = router;
