import mongoose, { Schema, model } from "mongoose";

const leaveSchema = new Schema(
  {
    employee: {
      type: Schema.Types.ObjectId,
      ref: "Employee",
      required: true,
    },
    leaveDoc: {
      type: String,
    },
    leaveDocId: {
      type: String,
    },
    description: {
      type: String,
      required: true,
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    leaveType: {
      type: String,
      enum: [
        "vacation",
        "sick",
        "maternity/paternity",
        "leave without pay",
        "annual leave",
        "other",
      ],
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected", "cancelled"],
      required: true,
      default: "pending",
    },
  },
  {
    timestamps: true,
  }
);

const Leave = mongoose.models.Leave || model("Leave", leaveSchema);

export default Leave;
