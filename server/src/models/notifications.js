import { Schema, model } from "mongoose";

const notificationSchema = new Schema({
  message: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ["task", "employee", "event"],
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  notificationId: {
    type: String,
    unique: true,
  },
});

const Notification = model("Notification", notificationSchema);

export default Notification;
