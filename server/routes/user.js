import express from "express";
// controllers
import user from "../controllers/user.js";

const router = express.Router();

router
  .get("/", user.onGetAllUsers)
  .post("/", user.onCreateUser)
  .get("/:id", user.onGetUserById)
  .get("/email/:email", user.onGetUserByEmail)
  .delete("/:id", user.onDeleteUserById)
  .post("/addFriend", user.onAddFriend)
  .get("/friends/allFriends", user.onGetFriends)
  .post("/removeFriend", user.onRemoveFriend);

export default router;
