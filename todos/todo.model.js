const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const todoSchema = new mongoose.Schema(
  {
    createdBy: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "user",
      required: true,
    },
    title: {
      type: String,
      required: true,
      maxlength: 150,
    },
    body: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = Todo = mongoose.model("todo", todoSchema);
