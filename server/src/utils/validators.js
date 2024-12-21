import Joi from "joi";

export const validatePayroll = (payroll) => {
  const schema = Joi.object({
    employee: Joi.string().required(),
    employeeId: Joi.string().required(),
    month: Joi.number().min(1).max(12).required(),
    year: Joi.number().required(),
    salary: Joi.number().required(),
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
