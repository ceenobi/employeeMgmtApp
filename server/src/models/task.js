import mongoose, { Schema, model } from "mongoose";

const taskSchema = new Schema(
  {
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "Employee",
      required: true,
    },
    title: {
      type: String,
      required: true,
      index: "text",
    },
    description: {
      type: String,
      required: true,
    },
    startDate: {
      type: Date,
      required: true,
    },
    dueDate: {
      type: Date,
    },
    file: {
      type: String,
    },
    fileId: {
      type: String,
    },
    completedAt: {
      type: Date,
    },
    status: {
      type: String,
      enum: [
        "planned",
        "started",
        "inprogress",
        "halfwayPast",
        "completed",
        "postponed",
        "cancelled",
        "overdue",
      ],
      required: true,
    },
    priority: {
      type: String,
      enum: ["low", "medium", "high"],
      required: true,
    },
    tags: {
      type: [String],
      default: [],
    },
    members: {
      type: [Schema.Types.ObjectId],
      ref: "Employee",
      default: [],
    },
    comments: [
      {
        userId: {
          type: Schema.Types.ObjectId,
          ref: "Employee",
          required: true,
        },
        comment: {
          type: String,
          required: true,
        },
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    // category: {
    //   type: String,
    //   enum: ["development", "design", "marketing", "management", "other"],
    //   default: "other",
    // },
  },
  {
    timestamps: true,
  }
);

const Task = mongoose.models.Task || model("Task", taskSchema);

export default Task;
