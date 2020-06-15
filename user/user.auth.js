const express = require("express");
const User = require("./user.model");
const bcrypt = require("bcrypt");
const authRouter = express.Router();
const jwt = require("jsonwebtoken");

// TODO: Refresh Tokens.
const newToken = (user) => {
  return jwt.sign({ id: user.id }, process.env.ACCESS_TOKEN_SECRET);
};

authRouter.route("/signup").post(async (req, res) => {
  console.log(req.body);
  if (!req.body.username || !req.body.password || !req.body.email) {
    return res
      .status(400)
      .send({ message: "Username, Email and password required" });
  }
  try {
    const user = await User.create(req.body);
    res.status(201).send();
  } catch (error) {
    console.log(error);
    res.status(500).send();
  }
});

authRouter.route("/login").post(async (req, res) => {
  if (!(req.body.email || req.body.username) || !req.body.password) {
    return res
      .status(400)
      .send({ message: "(Email or Username) and password required" });
  }
  let user = null;
  if (req.body.username) {
    user = await User.findOne({ username: req.body.username });
  } else {
    user = await User.findOne({ email: req.body.email });
  }
  if (!user) {
    return res.status(400).send("Can't find user");
  }
  try {
    if (await bcrypt.compare(req.body.password, user.password)) {
      const token = newToken(user);
      res.send({ token });
    } else {
      res.status(401).send("wrong password");
    }
  } catch (error) {
    console.log(error);
    res.status(500).send();
  }
});

const protect = (req, res, next) => {
  if (!req.headers.authorization) {
    return res.status(401).end();
  }
  let token = req.headers.authorization.split("Bearer ")[1];
  if (!token) {
    return res.status(401).end();
  }
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (error, user) => {
    if (error) return res.sendStatus(403);
    // TODO: get user to avoid fake tokens.
    req.user = user;
    // console.log("[USER]", user);
    next();
  });
};

module.exports = { authRouter, protect };
