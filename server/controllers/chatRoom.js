import makeValidation from "@withvoid/make-validation";
import ChatRoomModel, { CHAT_ROOM_TYPES } from "../models/ChatRoom.js";
import ChatMessageModel from "../models/ChatMessage.js";
import UserModel from "../models/User.js";
import { createRequire } from "module";

const require = createRequire(import.meta.url);

const io = require("socket.io-client");
const socket = io.connect("https://chatex2.herokuapp.com/", {
  reconnect: true,
});

export default {
  initiate: async (req, res) => {
    try {
      const validation = makeValidation((types) => ({
        payload: req.body,
        checks: {
          userIds: {
            type: types.array,
            options: { unique: true, empty: false, stringOnly: true },
          },
          type: { type: types.enum, options: { enum: CHAT_ROOM_TYPES } },
        },
      }));
      if (!validation.success) return res.status(400).json({ ...validation });

      const { userIds, type } = req.body;
      const { userId: chatInitiator } = req;
      const allUserIds = [...userIds, chatInitiator];
      const chatRoom = await ChatRoomModel.initiateChat(
        allUserIds,
        type,
        chatInitiator
      );
      return res.status(200).json({ success: true, chatRoom });
    } catch (error) {
      return res.status(500).json({ success: false, error: error });
    }
  },
  postMessage: async (req, res) => {
    try {
      const { roomId } = req.params;
      const validation = makeValidation((types) => ({
        payload: req.body,
        checks: {
          messageText: { type: types.string },
        },
      }));
      if (!validation.success) return res.status(400).json({ ...validation });

      const messagePayload = {
        messageText: req.body.messageText,
      };
      const currentLoggedUser = req.userId;
      const post = await ChatMessageModel.createPostInChatRoom(
        roomId,
        messagePayload,
        currentLoggedUser
      );

      socket.emit("message", { message: post });
      return res.status(200).json({ success: true, post: post });
    } catch (error) {
      return res.status(500).json({ success: false, error: error });
    }
  },
  getConversationByRoomId: async (req, res) => {
    try {
      const { roomId } = req.params;
      const room = await ChatRoomModel.getChatRoomByRoomId(roomId);
      if (!room) {
        return res.status(400).json({
          success: false,
          message: "No room exists for this id",
        });
      }
      const users = await UserModel.getUserByIds(room.userIds);
      const options = {
        page: parseInt(req.query.page) || 0,
        limit: parseInt(req.query.limit) || 1000,
      };
      const conversation = await ChatMessageModel.getConversationByRoomId(
        roomId,
        options
      );
      return res.status(200).json({
        success: true,
        conversation,
        users,
      });
    } catch (error) {
      return res.status(500).json({ success: false, error });
    }
  },

  markConversationReadByRoomId: async (req, res) => {
    try {
      const { roomId } = req.params;
      const room = await ChatRoomModel.getChatRoomByRoomId(roomId);
      if (!room) {
        return res.status(400).json({
          success: false,
          message: "No room exists for this id",
        });
      }
      const currentLoggedUser = req.userId;
      const result = await ChatMessageModel.markMessageRead(
        roomId,
        currentLoggedUser
      );
      return res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ success: false, error });
    }
  },

  getRecentConversation: async (req, res) => {},

  subscribe: async (req, res) => {
    try {
      const room = req.body.room;
      const friend = req.body.friend;

      // global.io.sockets.emit("subscribe", { room: room, otherUserId: friend });

      return res
        .status(200)
        .json({ success: true, room: room, friends: friend });
    } catch (error) {
      return res.status(500).json({ success: false, error });
    }
  },
};
