// controllers
import users from "../controllers/user.js";
// middlewares
import { encode } from "../middlewares/jwt.js";

import UserModel from "../models/User.js";
import { createRequire } from "module";
const require = createRequire(import.meta.url);

const bcrypt = require("bcryptjs");
const express = require("express");

const router = express.Router();

router.post("/login/:userId", encode, async (req, res, next) => {
  const emailFromForm = req.body.email;
  const passwordFromForm = req.body.password;
  console.log(emailFromForm);
  const existingUser = await UserModel.findOne({ email: emailFromForm });

  if (!existingUser)
    return res.status(404).json({ success: false, msg: "No email found" });

  const passwordMatch = bcrypt.compareSync(
    passwordFromForm,
    existingUser.password
  );

  if (!passwordMatch)
    return res.status(500).json({ success: false, msg: "Wrong Password" });

  req.session.email = emailFromForm;
  req.session.authorization = req.authToken;
  req.session.userId = existingUser._id;

  return res.status(200).json({
    success: true,
    email: req.session.email,
    authorization: req.authToken,
  });
});

router.get("/login", async (req, res) => {
  try {
    const email = req.session.email;
    console.log(req);
    if (!email) {
      return res.status(218).json({
        success: false,
        msg: "No session found",
      });
    }

    return res.status(200).json({
      success: true,
      email: req.session.email,
      auth: req.session.authorization,
      id: req.session.userId,
    });
  } catch (error) {
    return;
  }
});

router.get("/logout", async (req, res) => {
  if (req.session.email) {
    req.session.destroy();
    return res.status(200).json({
      success: true,
      msg: "logging out",
    });
  }
});

export default router;
