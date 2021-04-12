// utils
import makeValidation from "@withvoid/make-validation";
// models
import UserModel, { USER_TYPES } from "../models/User.js";

export default {
  onGetAllUsers: async (req, res) => {
    try {
      const users = await UserModel.getUsers();
      return res.status(200).json({ success: true, users });
    } catch (error) {
      return res.status(500).json({ success: false, error: error });
    }
  },
  onGetUserById: async (req, res) => {
    try {
      const user = await UserModel.getUserById(req.params.id);
      return res.status(200).json({ success: true, user });
    } catch (error) {
      return res.status(500).json({ success: false, error: error });
    }
  },
  onGetUserByEmail: async (req, res) => {
    try {
      const user = await UserModel.getUserByEmail(req.params.email);
      return res.status(200).json({ success: true, user });
    } catch (error) {
      return res.status(500).json({ success: false, error: error });
    }
  },
  onCreateUser: async (req, res) => {
    try {
      const validation = makeValidation((types) => ({
        payload: req.body,
        checks: {
          email: { type: types.string },
          password: { type: types.string },
        },
      }));
      if (!validation.success) return res.status(400).json(validation);

      const { email, password } = req.body;
      const existing = await UserModel.findOne({ email: email });

      if (existing)
        return res.json({ success: false, msg: "Account already exists!" });

      const user = await UserModel.createUser(email, password);
      return res.status(200).json({ success: true, user });
    } catch (error) {
      return res.status(500).json({ success: false, error: error });
    }
  },
  onDeleteUserById: async (req, res) => {
    try {
      const user = await UserModel.deleteByUserById(req.params.id);
      return res.status(200).json({
        success: true,
        message: `Deleted a count of ${user.deletedCount} user.`,
      });
    } catch (error) {
      return res.status(500).json({ success: false, error: error });
    }
  },

  onAddFriend: async (req, res) => {
    try {
      const email = req.session.email;
      const friend = req.body.friend;
      const existing = await UserModel.findOne({ email: email });
      const existingFriend = await UserModel.findOne({ email: friend });

      if (!existingFriend)
        return res
          .status(404)
          .json({ success: false, msg: "No user with that email." });

      for (var i = 0; i < existing.friendList.length; i++) {
        if (existing.friendList[i] == friend) {
          return res
            .status(500)
            .json({ success: false, msg: "Already a friend", existing });
        }
      }
      const user = await UserModel.addFriend(email, friend);
      return res.status(200).json({ success: true, user });
    } catch (error) {
      return res.status(500).json({ success: false, error: error });
    }
  },

  onRemoveFriend: async (req, res) => {
    try {
      const email = req.session.email;
      const friend = req.body.friend;
      console.log("yey");
      const existing = await UserModel.findOne({ email: email });
      const existingFriend = await UserModel.findOne({ email: friend });

      if (!existing)
        return res.status(404).json({ success: false, msg: "Not logged in." });

      for (var i = 0; i < existing.friendList.length; i++) {
        if (existing.friendList[i] == friend) {
          const user = await UserModel.removeFriend(email, friend);
          return res.status(200).json({ success: true, user });
        }
      }
    } catch (error) {
      return res.status(500).json({ success: false, error: error });
    }
  },

  onGetFriends: async (req, res) => {
    try {
      const email = req.session.email;
      const user = await UserModel.findOne({ email: email });
      return res.status(200).json({ success: true, user });
    } catch (error) {
      return res.status(500).json({ success: false, error: error });
    }
  },
};
