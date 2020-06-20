const express = require("express");
const User = require("./user.model");
const bcrypt = require("bcrypt");
const authRouter = express.Router();
const jwt = require("jsonwebtoken");

// TODO: Refresh Tokens.
const newToken = (user) => {
  return jwt.sign({ id: user.id }, process.env.ACCESS_TOKEN_SECRET);
};

const verifyToken = (token) =>
  new Promise((resolve, reject) => {
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, payload) => {
      if (err) return reject(err);
      resolve(payload);
    });
  });

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

const protect = async (req, res, next) => {
  console.log("Here");
  const bearer = req.headers.authorization;

  if (!bearer || !bearer.startsWith("Bearer ")) {
    console.error("errr");
    return res.status(401).end();
  }

  const token = req.headers.authorization.split("Bearer ")[1].trim();
  let payload;
  try {
    payload = await verifyToken(token);
  } catch (error) {
    console.error(error);
    return res.status(401).end();
  }

  const user = await User.findById(payload.id)
    .select("-password")
    .lean()
    .exec();

  if (!user) {
    console.error("No user");
    return res.status(401).end();
  }
  req.user = user;
  console.log("[USER]", user);
  next();
};

module.exports = { authRouter, protect };
