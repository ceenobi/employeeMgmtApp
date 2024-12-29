import Joi from "joi";

export const validatePayroll = (payroll) => {
  const schema = Joi.object({
    employee: Joi.string().required(),
    employeeId: Joi.string().required(),
    month: Joi.number().min(1).max(12).required(),
    year: Joi.number().required(),
    salary: Joi.number().required(),
    bank: Joi.string().required(),
    accountNumber: Joi.number().required(),
    accountName: Joi.string().required(),
    transport: Joi.number(),
    food: Joi.number(),
    miscellaneous: Joi.number(),
    late: Joi.number(),
    health: Joi.number(),
    others: Joi.number(),
    tax: Joi.number().min(0).max(100),
    leaveWithoutPay: Joi.number().min(0),
    lateDays: Joi.number().min(0),
    status: Joi.string().valid("draft", "pending", "paid", "cancelled"),
    payPeriodStart: Joi.date().required(),
    payPeriodEnd: Joi.date().required(),
    payPeriod: Joi.object({
      start: Joi.date().required(),
      end: Joi.date().required(),
    }).required(),
  });

  return schema.validate(payroll);
};

export const validateTask = (task) => {
  const schema = Joi.object({
    title: Joi.string().required(),
    description: Joi.string().required(),
    startDate: Joi.date().required(),
    dueDate: Joi.date().optional(),
    completedAt: Joi.date().optional(),
    file: Joi.string().allow("").optional(),
    fileId: Joi.string().optional(),
    status: Joi.string()
      .valid("planned", "inprogress", "completed", "postponed", "cancelled")
      .required(),
    priority: Joi.string().valid("low", "medium", "high").required(),
    tags: Joi.string().allow("").optional(),
    members: Joi.string().optional(),
    comments: Joi.array()
      .items(
        Joi.object({
          userId: Joi.string().required(),
          comment: Joi.string().required(),
          createdAt: Joi.date().default(Date.now),
        })
      )
      .default([]),
  });

  return schema.validate(task);
};

export const validateLeave = (leave) => {
  const schema = Joi.object({
    description: Joi.string().required(),
    startDate: Joi.date().required(),
    endDate: Joi.date().required(),
    leaveType: Joi.string()
      .valid(
        "vacation",
        "sick",
        "maternity/paternity",
        "leave without pay",
        "annual leave",
        "other"
      )
      .required(),
    status: Joi.string()
      .valid("pending", "approved", "declined", "cancelled")
      .optional(),
    leaveDoc: Joi.string().allow("").optional(),
    leaveDocId: Joi.string().allow("").optional(),
  });

  return schema.validate(leave);
};

export const validateEvent = (event) => {
  const schema = Joi.object({
    title: Joi.string().required(),
    description: Joi.string().required(),
    startDate: Joi.date().required(),
    endDate: Joi.date().required(),
    location: Joi.string().allow("").optional(),
    photo: Joi.string().allow("").optional(),
    photoId: Joi.string().allow("").optional(),
    status: Joi.string()
      .valid("ongoing", "past", "cancelled", "postponed", "upcoming")
      .optional(),
    time: Joi.string().optional(),
  });

  return schema.validate(event);
};
