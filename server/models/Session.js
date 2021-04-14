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

session.statics.findSession = async function (email) {
  try {
    const sess = await this.findOne({ session: { email: email } });
    if (!sess) {
      return res.status(218).json({ success: false, msg: "No session found" });
    }

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
