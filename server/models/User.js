import mongoose from "mongoose";
import { v4 as uuidv4 } from "uuid";

export const USER_TYPES = {
  CONSUMER: "consumer",
  SUPPORT: "support",
};

const userSchema = new mongoose.Schema(
  {
    _id: {
      type: String,
      default: () => uuidv4().replace(/\-/g, ""),
    },
    email: String,
    password: String,
    friendList: Array,
  },
  {
    timestamps: true,
    collection: "users",
  }
);

userSchema.statics.createUser = async function (email, password) {
  try {
    const user = await this.create({ email, password });
    return user;
  } catch (error) {
    throw error;
  }
};

userSchema.statics.addFriend = async function (email, friendMail) {
  try {
    const user = await this.findOne({ email: email });
    if (!user) throw { error: "No user found with this email" };

    const newUser = await this.updateOne(
      { email: email },
      { $push: { friendList: friendMail } }
    );
    return user;
  } catch (error) {
    throw error;
  }
};

userSchema.statics.removeFriend = async function (email, friendMail) {
  try {
    const user = await this.findOne({ email: email });
    if (!user) throw { error: "No user found" };

    const rem = await this.updateOne(
      { email: email },
      { $pull: { friendList: friendMail } }
    );
    return user;
  } catch (error) {
    throw error;
  }
};

userSchema.statics.getUserById = async function (id) {
  try {
    const user = await this.findOne({ _id: id });
    if (!user) throw { error: "No user with this id found" };
    return user;
  } catch (error) {
    throw error;
  }
};

userSchema.statics.getUserByEmail = async function (email) {
  try {
    const user = await this.findOne({ email: email });
    if (!user) throw { error: "No user with that email" };
    return user;
  } catch (error) {
    throw error;
  }
};

userSchema.statics.getUsers = async function () {
  try {
    const users = await this.find();
    return users;
  } catch (error) {
    throw error;
  }
};

userSchema.statics.deleteByUserById = async function (id) {
  try {
    const result = await this.remove({ _id: id });
    return result;
  } catch (error) {
    throw error;
  }
};

userSchema.statics.getUserByIds = async function (ids) {
  try {
    const users = await this.find({ _id: { $in: ids } });
    return users;
  } catch (error) {
    throw error;
  }
};

export default mongoose.model("User", userSchema);
