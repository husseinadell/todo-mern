const { Router } = require("express");
const { me, updateMe } = require("./user.controller");

const router = Router();

router.route("/").get(me).put(updateMe);

module.exports = router;
