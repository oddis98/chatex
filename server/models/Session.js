import mongoose from "mongoose";
import { v4 as uuidv4 } from "uuid";

const session = new mongoose.Schema(
  {
    _id: {
      type: String,
      default: () => uuidv4().replace(/\-/g, ""),
    },
  },
  {
    collection: "mySessions",
  }
);

session.statics.findSession = async function (sessionID) {
  try {
    const sess = await this.findOne({ sessionID: sessionID });
    if (!sess) {
      console.log("did not find a session...");
      return res.status(218).json({ success: false, msg: "No session found" });
    }

    console.log("found a session!");

    return res.status(200).json({
      success: true,
      email: sess.session.email,
      auth: sess.session.auth,
      id: sess.session.userId,
    });
  } catch (error) {
    return;
  }
};

export default mongoose.model("Session", session);
