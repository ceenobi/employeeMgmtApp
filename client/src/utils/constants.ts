import {
  BadgeDollarSign,
  Building,
  Calendar,
  CalendarDays,
  LayoutDashboard,
  ListTodo,
  Settings,
  Users,
} from "lucide-react";
import {
  validateConfirmPassword,
  validateEmail,
  validateField,
  validateFirstName,
  validateLastName,
  validatePassword,
  validatePhone,
} from "./formValidate";

export const inputFields = [
  {
    label: "Email",
    type: "email",
    id: "email",
    name: "email",
    placeholder: "johndoe@email.com",
    validate: (value: string) => validateEmail(value),
    isRequired: true,
  },
  {
    label: "First Name",
    type: "text",
    id: "firstName",
    name: "firstName",
    placeholder: "john",
    validate: (value: string) => validateFirstName(value),
    isRequired: true,
  },
  {
    label: "Last Name",
    type: "text",
    id: "lastName",
    name: "lastName",
    placeholder: "doe",
    validate: (value: string) => validateLastName(value),
    isRequired: true,
  },
  {
    label: "Password",
    type: "password",
    id: "password",
    name: "password",
    placeholder: "password",
    validate: (value: string) => validatePassword(value),
    isRequired: true,
  },
  {
    label: "Confirm Password",
    type: "password",
    id: "confirmPassword",
    name: "confirmPassword",
    placeholder: "confirm password",
    validate: (value: string) => validateConfirmPassword(value),
    isRequired: true,
  },
  {
    label: "Phone Number",
    type: "tel",
    id: "phone",
    name: "phone",
    placeholder: "00000000",
    validate: (value: string) => validatePhone(value),
    isRequired: true,
  },
  {
    label: "Start Date",
    type: "date",
    id: "startDate",
    name: "startDate",
    placeholder: "24/24/24",
    validate: (value: string) => validateField(value, "This field is required"),
    isRequired: true,
  },
  {
    label: "End Date",
    type: "date",
    id: "endDate",
    name: "endDate",
    placeholder: "24/24/24",
    validate: () => null,
    isRequired: false,
  },
  {
    label: "Due date",
    type: "date",
    id: "dueDate",
    name: "dueDate",
    placeholder: "24/24/24",
    validate: () => null,
    isRequired: false,
  },
  {
    label: "Date of Birth",
    type: "date",
    id: "dateOfBirth",
    name: "dateOfBirth",
    placeholder: "24/24/24",
    validate: (value: string) => validateField(value, "This field is required"),
    isRequired: true,
  },
  {
    label: "Title",
    type: "text",
    id: "title",
    name: "title",
    placeholder: "title",
    validate: (value: string) => validateField(value, "This field is required"),
    isRequired: true,
  },
  {
    label: "Time",
    type: "time",
    id: "time",
    name: "time",
    placeholder: "Time for event",
    validate: (value: string) =>
      validateField(value, "Set a time for your event"),
    isRequired: true,
  },
  {
    label: "Location",
    type: "text",
    id: "location",
    name: "location",
    placeholder: "locaton",
    validate: () => null,
    isRequired: false,
  },
  {
    label: "Current Password",
    type: "password",
    id: "currentPassword",
    name: "currentPassword",
    placeholder: "current password",
    validate: (value: string) => validatePassword(value),
    isRequired: true,
  },
  {
    label: "New Password",
    type: "password",
    id: "newPassword",
    name: "newPassword",
    placeholder: "new password",
    validate: (value: string) => validateConfirmPassword(value),
    isRequired: true,
  },
  {
    label: "Employee Id",
    type: "text",
    id: "employeeId",
    name: "employeeId",
    placeholder: "employeeId",
    validate: (value: string) => validateField(value, "This field is required"),
    isRequired: true,
  },
  {
    label: "Salary",
    type: "number",
    id: "salary",
    name: "salary",
    placeholder: "0",
    validate: (value: string) => validateField(value, "This field is required"),
    isRequired: true,
    min: 0,
  },
  {
    label: "Allowances",
    type: "text",
    id: "allowances",
    name: "allowances",
    placeholder: "e.g. housing:1000, transport:500",
    validate: () => null,
    isRequired: false,
  },
  {
    label: "Tax - value as percentage",
    type: "number",
    id: "tax",
    name: "tax",
    placeholder: "0%",
    validate: (value: string) => validateField(value, "Set tax rate"),
    isRequired: true,
    min: 0,
    max: 100,
  },
  {
    label: "Deductions",
    type: "text",
    id: "deductions",
    name: "deductions",
    placeholder: "e.g. late:200, insurance:300",
    validate: () => null,
    isRequired: false,
  },
  {
    label: "Late Days",
    type: "number",
    id: "lateDays",
    name: "lateDays",
    placeholder: "0",
    validate: (value: string) => validateField(value, "This field is required"),
    isRequired: true,
    min: 0,
  },
  {
    label: "Leave Without Pay",
    type: "number",
    id: "leaveWithoutPay",
    name: "leaveWithoutPay",
    placeholder: "0",
    validate: () => null,
    isRequired: false,
    min: 0,
  },
  {
    label: "Payroll Date",
    type: "date",
    id: "payrollDate",
    name: "payrollDate",
    placeholder: "24/24/24",
    validate: (value: string) => validateField(value, "This field is required"),
    isRequired: true,
  },
  {
    label: "Department Name",
    type: "text",
    id: "name",
    name: "name",
    placeholder: "sales",
    validate: (value: string) => validateField(value, "This field is required"),
    isRequired: true,
  },
  {
    label: "Month",
    type: "number",
    id: "month",
    name: "month",
    placeholder: "january",
    validate: (value: string) => validateField(value, "Please select a month"),
    isRequired: true,
    min: 1,
    max: 12,
  },
  {
    label: "Year",
    type: "number",
    id: "year",
    name: "year",
    placeholder: "2024",
    validate: (value: string) =>
      validateField(value, "Please select a year between 2024 and 2099"),
    isRequired: true,
    min: 2024,
    max: 2099,
  },
  {
    label: "Pay period start date",
    type: "date",
    id: "payPeriodStartDate",
    name: "payPeriodStart",
    placeholder: "24/24/24",
    validate: (value: string) => validateField(value, "This field is required"),
    isRequired: true,
  },
  {
    label: "Pay period end date",
    type: "date",
    id: "payPeriodEndDate",
    name: "payPeriodEnd",
    placeholder: "24/24/24",
    validate: (value: string) => validateField(value, "This field is required"),
    isRequired: true,
  },
  {
    label: "Transport",
    type: "number",
    id: "transport",
    name: "transport",
    placeholder: "transport allowance",
    validate: () => null,
    isRequired: false,
  },
  {
    label: "Feeding",
    type: "number",
    id: "food",
    name: "food",
    placeholder: "feeding allowance",
    validate: () => null,
    isRequired: false,
  },
  {
    label: "Miscellaneous",
    type: "number",
    id: "miscellaneous",
    name: "miscellaneous",
    placeholder: "miscellaneous allowance",
    validate: () => null,
    isRequired: false,
  },
  {
    label: "Lateness Fee",
    type: "number",
    id: "late",
    name: "late",
    placeholder: "lateFee deductions",
    validate: () => null,
    isRequired: false,
  },
  {
    label: "Health Insurance",
    type: "number",
    id: "health",
    name: "health",
    placeholder: "health insurance deductions",
    validate: () => null,
    isRequired: false,
  },
  {
    label: "Others",
    type: "number",
    id: "others",
    name: "others",
    placeholder: "others deductions",
    validate: () => null,
    isRequired: false,
  },
  {
    label: "Home Address",
    type: "text",
    id: "homeAddress",
    name: "homeAddress",
    placeholder: "home address",
    validate: (value: string) => validateField(value, "This field is required"),
    isRequired: true,
  },
  {
    label: "State",
    type: "text",
    id: "state",
    name: "state",
    placeholder: "home state where you reside",
    validate: (value: string) => validateField(value, "This field is required"),
    isRequired: true,
  },
  {
    label: "Country",
    type: "text",
    id: "country",
    name: "country",
    placeholder: "home country where you reside",
    validate: (value: string) => validateField(value, "This field is required"),
    isRequired: true,
  },
  {
    label: "Bank Name",
    type: "text",
    id: "bank",
    name: "bank",
    placeholder: "your bank for payment",
    validate: (value: string) => validateField(value, "This field is required"),
    isRequired: true,
  },
  {
    label: "Bank Account Number",
    type: "number",
    id: "accountNumber",
    name: "accountNumber",
    placeholder: "your bank account number",
    validate: (value: string) => validateField(value, "This field is required"),
    isRequired: true,
  },
  {
    label: "Bank Account Name",
    type: "text",
    id: "accountName",
    name: "accountName",
    placeholder: "your bank account name",
    validate: (value: string) => validateField(value, "This field is required"),
    isRequired: true,
  },
];

export const sidebarLinks = [
  {
    id: 1,
    Icon: LayoutDashboard,
    name: "Dashboard",
    path: "/",
  },
  {
    id: 2,
    Icon: ListTodo,
    name: "Tasks",
    path: "/tasks",
  },
  {
    id: 3,
    Icon: Building,
    name: "Departments",
    path: "/departments",
  },
  {
    id: 4,
    Icon: Users,
    name: "Employees",
    path: "/employees",
  },
  {
    id: 5,
    Icon: CalendarDays,
    name: "Events",
    path: "/events",
  },
  {
    id: 6,
    Icon: Calendar,
    name: "Leaves",
    path: "/leaves",
  },
  {
    id: 7,
    Icon: BadgeDollarSign,
    name: "Payrolls",
    path: "/payrolls",
  },
  {
    id: 8,
    Icon: Settings,
    name: "Portal",
    path: "/portal",
  },
];

export const gender = [
  {
    value: "male",
  },
  {
    value: "female",
  },
  {
    value: "other",
  },
];
export const maritalStatus = [
  {
    value: "single",
  },
  {
    value: "married",
  },
  {
    value: "divorced",
  },
  {
    value: "widowed",
  },
];

export const jobType = [
  {
    value: "full-time",
  },
  {
    value: "part-time",
  },
  {
    value: "contract",
  },
  {
    value: "hybrid",
  },
  {
    value: "remote",
  },
];

export const jobTitle = [
  { value: "Web developer" },
  { value: "Customer service" },
  { value: "Student laison" },
  { value: "Facility manager" },
  { value: "Utility" },
  { value: "Social media handler" },
  { value: "Head of Products" },
  { value: "HR Manager" },
  { value: "Data scientist" },
];

export const employeeRole = [
  { value: "user" },
  {
    value: "admin",
  },
  {
    value: "super-admin",
  },
];

export const employeeStatusColorMap: Record<string, string> = {
  active: "bg-success",
  sick: "bg-red-500",
  other: "bg-teal-500 ",
  leave: "bg-yellow-700",
};

export const employeeStatus = [
  { value: "active" },
  { value: "leave" },
  {
    value: "sick",
  },
  {
    value: "other",
  },
];

export const getRandomColor = (text: string) => {
  const colors = [
    "#ff9c6e",
    "#ff7875",
    "#ffc069",
    "#ffd666",
    "#fadb14",
    "#95de64",
    "#5cdbd3",
    "#69c0ff",
    "#85a5ff",
    "#b37feb",
    "#ff85c0",
  ];

  let hash = 0;
  for (let i = 0; i < text.length; i++) {
    hash = text.charCodeAt(i) + ((hash << 5) - hash);
    hash = hash & hash;
  }
  hash = ((hash % colors.length) + colors.length) % colors.length;

  return colors[hash];
};

export const months = [
  {
    name: "January",
    value: 1,
  },
  {
    name: "February",
    value: 2,
  },
  {
    name: "March",
    value: 3,
  },
  {
    name: "April",
    value: 4,
  },
  {
    name: "May",
    value: 5,
  },
  {
    name: "June",
    value: 6,
  },
  {
    name: "July",
    value: 7,
  },
  {
    name: "August",
    value: 8,
  },
  {
    name: "September",
    value: 9,
  },
  {
    name: "October",
    value: 10,
  },
  {
    name: "November",
    value: 11,
  },
  {
    name: "December",
    value: 12,
  },
];

export const payrollStatus = [
  { value: "draft" },
  { value: "pending" },
  {
    value: "paid",
  },
  {
    value: "cancelled",
  },
];
export const taskStatus = [
  { value: "planned" },
  { value: "started" },
  { value: "inprogress" },
  { value: "halfwayPast" },
  { value: "completed" },
  {
    value: "postponed",
  },
  {
    value: "cancelled",
  },
  {
    value: "overdue",
  },
];
export const taskPriority = [
  { value: "low" },
  { value: "medium" },
  { value: "high" },
];

export const taskStatusColors = {
  planned: "bg-gray-200 text-gray-800",
  started: "bg-accent text-gray-800",
  inprogress: "bg-sky-400 text-zinc-800",
  halfwayPast: "bg-sky-400 text-zinc-800",
  completed: "bg-green-200 text-green-800",
  postponed: "bg-secondary text-zinc-800",
  cancelled: "bg-red-200 text-red-800",
  overdue: "bg-red-200 text-red-800",
};

export const taskPriorityColors = {
  low: "bg-gray-300 text-gray-900",
  medium: "bg-yellow-600 text-zinc-800",
  high: "bg-red-400 text-red-800",
};

export const taskProgress = {
  planned: "0%",
  started: "25%",
  inprogress: "50%",
  halfwayPast: "75%",
  completed: "100%",
  postponed: "0%",
  cancelled: "0%",
  overdue: "100%",
};

export const taskProgressColors = {
  planned: "#808080", // gray
  started: "#00BFFF", // Deep Sky Blue
  inprogress: "#fbbf24", // amber
  halfwayPast: "#0d9488", // teal
  completed: "#065f46", // Green
  postponed: "#FFFF00", // Yellow
  cancelled: "#FF4500", // Orange Red
  overdue: "#FF4500", // Orange Red
};

export const leaveType = [
  { value: "vacation" },
  { value: "sick" },
  { value: "maternity/paternity" },
  { value: "annual leave" },
  { value: "leave without pay" },
  { value: "other" },
];

export const leaveStatus = {
  pending: "badge-secondary",
  approved: "badge-success",
  rejected: "badge-error",
  cancelled: "badge-info",
};

export const updateLeaveStatus = [
  { value: "pending" },
  { value: "approved" },
  { value: "rejected" },
  { value: "cancelled" },
];

export const eventStatus = [
  { value: "upcoming" },
  { value: "ongoing" },
  { value: "past" },
  { value: "postponed" },
  { value: "cancelled" },
];

export const eventStatusColors = {
  upcoming: "bg-gray-200 text-gray-800",
  ongoing: "bg-accent text-gray-800",
  past: "bg-warning text-zinc-800",
  postponed: "bg-secondary text-zinc-800",
  cancelled: "bg-red-200 text-red-800",
};
