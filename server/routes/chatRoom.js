import express from "express";
// controllers
import chatRoom from "../controllers/chatRoom.js";

const router = express.Router();

router
  .get("/", chatRoom.getRecentConversation)
  .get("/:roomId", chatRoom.getConversationByRoomId)
  .post("/initiate", chatRoom.initiate)
  .post("/:roomId/message", chatRoom.postMessage)
  .put("/:roomId/mark-read", chatRoom.markConversationReadByRoomId)
  .post("/subscribe", chatRoom.subscribe);

export default router;
