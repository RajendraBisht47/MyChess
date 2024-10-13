const { Router } = require("express");
const User = require("../models/user");
const router = Router();
const { cookies, decode } = require("../authentication/cookie");

router.post("/signin", async (req, res) => {
  const { username, password } = req.body;
  // console.log(username, password);
  // console.log(req.body);
  if (!username || !password)
    return res
      .status(400)
      .json({ message: "Invalid username or password", success: false });

  const exist = await User.findOne({ username });
  if (exist) {
    return res
      .status(400)
      .json({ message: "User already exist", success: false });
  }

  const user = await User.create({
    username,
    password,
  });

  const cookie = cookies(user);

  // setTimeout(() => {
  //   res
  //     .cookie("token", cookie)
  //     .json({ message: "User created successfully", success: true });
  // }, 5000);
  res
    .cookie("token", cookie)
    .json({ message: "User created successfully", success: true, user });
});

router.post("/login", async (req, res) => {
  const { username, password } = req.body;
  // console.log(username, password);
  // console.log(req.body);
  if (!username || !password)
    return res
      .status(400)
      .json({ message: "Invalid username or password", success: false });

  const exist = await User.findOne({ username, password });

  if (!exist) {
    return res
      .status(400)
      .json({ message: "Invalid username or password", success: false });
  }

  const cookie = cookies(exist);

  // setTimeout(() => {
  //   res
  //     .cookie("token", cookie)
  //     .json({ message: "User logged in successfully", success: true });
  // }, 5000);
  res.cookie("token", cookie).json({
    message: "User logged in successfully",
    success: true,
    user: exist,
  });
});

router.get("/logout", (req, res) => {
  res.clearCookie("token").redirect(`${process.env.UI_URL}/signin`);
});
module.exports = router;
