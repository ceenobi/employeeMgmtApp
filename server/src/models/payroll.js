import mongoose, { Schema, model } from "mongoose";

const payrollSchema = new Schema(
  {
    comment: {
      type: [String],
    },
    paymentDate: {
      type: Date,
    },
    payrollId: {
      type: String,
      required: true,
      unique: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "Employee",
      required: true,
    },
    employeeId: {
      type: String,
      required: true,
      index: true,
    },
    month: {
      type: Number,
      required: true,
      min: 1,
      max: 12,
    },
    year: {
      type: Number,
      required: true,
    },
    salary: {
      type: Number,
      required: true,
    },
    allowances: {
      type: Map,
      of: Number,
      default: new Map(),
    },
    deductions: {
      type: Map,
      of: Number,
      default: new Map(),
    },
    tax: {
      type: Number,
      required: true,
    },
    net: {
      type: Number,
      required: true,
      default: 0,
    },
    lateDays: {
      type: Number,
      required: true,
      default: 0,
    },
    leaveWithoutPay: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ["draft", "pending", "paid", "cancelled"],
      default: "draft",
    },
    lastAutoGenerated: {
      type: Date,
    },
    autoGenerateEnabled: {
      type: Boolean,
      default: true,
    },
    payPeriod: {
      start: {
        type: Date,
        required: true,
      },
      end: {
        type: Date,
        required: true,
      },
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for efficient querying
payrollSchema.index({ employeeId: 1, month: 1, year: 1 }, { unique: true });
payrollSchema.index({ status: 1 });

// Virtual for total allowances
payrollSchema.virtual("totalAllowances").get(function () {
  return Array.from(this.allowances.values()).reduce(
    (sum, value) => sum + value,
    0
  );
});

// Virtual for total deductions
payrollSchema.virtual("totalDeductions").get(function () {
  return Array.from(this.deductions.values()).reduce(
    (sum, value) => sum + value,
    0
  );
});

// Static method to generate payroll ID
payrollSchema.statics.generatePayrollId = function (employeeId, month, year) {
  return `PAY-${employeeId}-${month}-${year}`;
};

// Static method to check if it's time to generate payroll
payrollSchema.statics.shouldGeneratePayroll = function (lastGenerated) {
  if (!lastGenerated) return true;

  const now = new Date();
  const daysSinceLastGenerated = Math.floor(
    (now - lastGenerated) / (1000 * 60 * 60 * 24)
  );
  return daysSinceLastGenerated >= 25;
};

// Method to calculate net salary
payrollSchema.methods.calculateNet = function () {
  const grossSalary = this.salary;
  const totalAllowances = this.totalAllowances;
  const totalDeductions = this.totalDeductions;
  const taxAmount = (grossSalary + totalAllowances) * (this.tax / 100);

  this.net = grossSalary + totalAllowances - totalDeductions - taxAmount;
  return this.net;
};

// Pre-save middleware to ensure payroll ID and calculations
payrollSchema.pre("save", async function (next) {
  if (!this.payrollId) {
    this.payrollId = this.constructor.generatePayrollId(
      this.employeeId,
      this.month,
      this.year
    );
  }

  if (
    this.isModified("salary") ||
    this.isModified("allowances") ||
    this.isModified("deductions") ||
    this.isModified("tax")
  ) {
    this.calculateNet();
  }

  next();
});

const Payroll = mongoose.models.Payroll || model("Payroll", payrollSchema);

export default Payroll;
