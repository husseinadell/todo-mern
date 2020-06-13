// const bcrypt = require("bcrypt");

// app.post("/users/signup", async (req, res) => {
//   try {
//     // const salt = await bcrypt.genSalt();
//     const hashedPassword = await bcrypt.hash(req.body.password, 10);
//     // console.log(salt);
//     console.log(hashedPassword);
//     const user = { name: req.body.name, password: hashedPassword };
//     users.push(user);
//     res.status(201).send();
//   } catch (error) {
//     console.log(error);
//     res.status(500).send();
//   }
// });

// app.post("/users/login", async (req, res) => {
//   const user = users.find((user) => user.name === req.body.name);
//   if (!user) {
//     return res.status(400).send("Can't find user");
//   }
//   try {
//     if (await bcrypt.compare(req.body.password, user.password)) {
//       res.send("Success");
//     } else {
//       res.send("wrong password");
//     }
//   } catch (error) {
//     res.status(500).send();
//   }
// });
