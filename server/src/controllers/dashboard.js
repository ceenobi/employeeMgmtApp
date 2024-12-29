import Employee from "../models/employee.js";
import Task from "../models/task.js";
import Payroll from "../models/payroll.js";
import Leave from "../models/leave.js";
import Event from "../models/event.js";
import tryCatch from "../utils/tryCatchFn.js";
import dayjs from "dayjs";

export const getDashboardData = tryCatch(async (req, res, next) => {
  const [employeeCount, taskCount, leaveCount, eventCount, payrollCount] =
    await Promise.all([
      Employee.countDocuments(),
      Task.countDocuments(),
      Leave.countDocuments(),
      Event.countDocuments(),
      Payroll.countDocuments(),
    ]);

  const employees = await Employee.find().sort({ createdAt: -1 });
  const tasks = await Task.find().sort({ createdAt: -1 });
  const leaves = await Leave.find().populate(
    "employee",
    "firstName lastName photo"
  );
  const events = await Event.find().sort({ createdAt: -1 });
  const payrolls = await Payroll.find()
    .populate("userId", "dept")
    .sort({ createdAt: -1 });
  const recentEmployees = await Employee.find()
    .select("firstName lastName photo")
    .sort({ createdAt: -1 })
    .limit(3);

  //handle leaves
  const leaveStats = await Leave.aggregate([
    { $group: { _id: "$status", count: { $sum: 1 } } },
  ]);

  const leaveCounts = leaveStats.reduce((acc, leave) => {
    acc[leave._id] = leave.count;
    return acc;
  }, {});

  const getApprovedLeaves =
    leaves.filter((leave) => leave.status === "approved") || 0;
  const getPendingLeaves =
    leaves.filter((leave) => leave.status === "pending") || 0;
  const getRejectedLeaves =
    leaves.filter((leave) => leave.status === "rejected") || 0;

  const approvedLeavesThisMonth = getApprovedLeaves.filter((leave) => {
    let currentMonth = dayjs().get("month");
    let startDateObj = dayjs(leave.createdAt);
    const leaveMonth = startDateObj.get("month");
    return leaveMonth === currentMonth;
  });
  const leavesPercentage = (approvedLeavesThisMonth?.length / leaveCount) * 100;

  //handle events
  const getEventsThisMonth = events.filter((event) => {
    let currentMonth = dayjs().get("month");
    let startDateObj = dayjs(event.createdAt);
    const eventMonth = startDateObj.get("month");
    return eventMonth === currentMonth;
  });
  const eventsPercentage = (getEventsThisMonth?.length / eventCount) * 100;

  //handle employees
  const employeesPercentageForTheMonth = employees?.filter((emp) => {
    const currentMonth = dayjs().get("month");
    const startDateObj = dayjs(emp.createdAt);
    const employeeMonth = startDateObj.get("month");
    return employeeMonth === currentMonth;
  });
  const employeesPercentage =
    (employeesPercentageForTheMonth?.length / employeeCount) * 100;

  //handle tasks
  const totalTasks = tasks.length;
  const pendingTasks = tasks.filter((task) => task.status === "pending").length;
  const inprogressTasks = tasks.filter((task) => task.status === "inprogress").length;
  const overdueTasks = tasks.filter(
    (task) => new Date(task.dueDate) < new Date()
  ).length;
  const completedTask = tasks.filter(
    (task) => task.status === "completed"
  ).length;
  const getTasksThisMonth = tasks.filter((task) => {
    let currentMonth = dayjs().get("month");
    let startDateObj = dayjs(task.createdAt);
    const taskMonth = startDateObj.get("month");
    return taskMonth === currentMonth;
  });
  const tasksPercentage = (completedTask / taskCount) * 100;

  const tasksByPriority = tasks.reduce((acc, task) => {
    const priority = task.priority || "Low"; // Default to 'Low' if no priority is set
    acc[priority] = (acc[priority] || 0) + 1;
    return acc;
  }, {});

  //handle payrolls
  const getPayrollHistoryNetpay = payrolls.reduce(
    (acc, curr) => acc + curr.net,
    0
  );
  // Calculate average payroll amount
  const averagePayrollAmount =
    payrolls.length > 0 ? getPayrollHistoryNetpay / payrolls.length : 0;

  const lastYearPayrolls = await Payroll.find({
    createdAt: { $gte: dayjs().subtract(1, "year").toDate() },
  });

  // Calculate total net pay for the last two 6-month periods
  const totalNetPayFirstHalf = lastYearPayrolls
    .filter((payroll) =>
      dayjs(payroll.createdAt).isBefore(dayjs().subtract(6, "months"))
    )
    .reduce((acc, payroll) => acc + payroll.net, 0);

  const totalNetPaySecondHalf = lastYearPayrolls
    .filter((payroll) =>
      dayjs(payroll.createdAt).isAfter(dayjs().subtract(6, "months"))
    )
    .reduce((acc, payroll) => acc + payroll.net, 0);

  // Calculate payroll growth rate
  let payrollGrowthRate = 0;
  if (totalNetPayFirstHalf > 0) {
    payrollGrowthRate =
      ((totalNetPaySecondHalf - totalNetPayFirstHalf) / totalNetPayFirstHalf) *
      100;
  }

  // Calculate percentage change
  let payrollPercentageChange = 0;
  if (totalNetPayFirstHalf > 0) {
    payrollPercentageChange =
      ((totalNetPaySecondHalf - totalNetPayFirstHalf) / totalNetPayFirstHalf) *
      100;
  }
  const getTotalDeductions = payrolls.reduce(
    (acc, curr) =>
      acc +
      curr.deductions.late +
      curr.deductions.health +
      curr.deductions.others,
    0
  );
  const getTotalAllowances = payrolls.reduce(
    (acc, curr) =>
      acc +
      curr.allowances.transport +
      curr.allowances.food +
      curr.allowances.miscellaneous,
    0
  );
  //breakdown
  let totalDeductions = {
    late: 0,
    health: 0,
    others: 0,
  };

  let totalAllowances = {
    transport: 0,
    food: 0,
    miscellaneous: 0,
  };

  // Calculate totals for deductions and allowances
  payrolls.forEach((payroll) => {
    totalDeductions.late += payroll.deductions.late || 0;
    totalDeductions.health += payroll.deductions.health || 0;
    totalDeductions.others += payroll.deductions.others || 0;

    totalAllowances.transport += payroll.allowances.transport || 0;
    totalAllowances.food += payroll.allowances.food || 0;
    totalAllowances.miscellaneous += payroll.allowances.miscellaneous || 0;
  });
  //comparison with budget
  const budget = 12000000;
  const budgetDifference = getPayrollHistoryNetpay - budget;
  const budgetComparisonPercentage =
    budget > 0 ? (budgetDifference / budget) * 100 : 0;

  //get upcoming payroll
  //const lastPayroll = payrolls[0]; // Assuming the latest payroll is the first in the sorted array
  //const lastGeneratedDate = lastPayroll ? lastPayroll.lastAutoGenerated : null;
  //const shouldGenerate = Payroll.shouldGeneratePayroll(lastGeneratedDate);
  let upcomingPayrollDates = [];
  const currentDate = dayjs();
  for (let i = 1; i <= 3; i++) {
    // Get the next 3 payroll dates
    let nextDate = currentDate.add(i, "month");
    // Set the date to the 22nd of the month
    nextDate = nextDate.date(22);
    upcomingPayrollDates.push(nextDate.format("MMMM D, YYYY")); // Format the date
  }

  //get net pay distribution
  let netPayDistribution = {};
  payrolls.forEach((payroll) => {
    const department = payroll.userId.dept;
    const netPay = payroll.net;

    if (!netPayDistribution[department]) {
      netPayDistribution[department] = 0;
    }
    netPayDistribution[department] += netPay;
  });
  const totalNetDistributionPay = Object.values(netPayDistribution).reduce(
    (acc, value) => acc + value,
    0
  );
  const netPayDistributionPercentage = Object.entries(netPayDistribution).map(
    ([department, netPay]) => ({
      department,
      netPay,
      percentage:
        totalNetDistributionPay > 0
          ? (netPay / totalNetDistributionPay) * 100
          : 0,
    })
  );

  //payroll chart
  const historicalPayrolls = await Payroll.find({
    createdAt: { $gte: dayjs().subtract(12, "months").toDate() },
  }).sort({ createdAt: 1 });

  const payrollTrends = historicalPayrolls.map((payroll) => ({
    date: dayjs(payroll.createdAt).format("MMMM YYYY"),
    netPay: payroll.net,
  }));
  const aggregatedTrends = payrollTrends.reduce((acc, current) => {
    const monthYear = current.date;
    if (!acc[monthYear]) {
      acc[monthYear] = 0;
    }
    acc[monthYear] += current.netPay;
    return acc;
  }, {});

  const chartData = Object.entries(aggregatedTrends).map(
    ([monthYear, netPay]) => ({
      date: monthYear,
      netPay,
    })
  );

  res.status(200).json({
    success: true,
    data: {
      employee: {
        employeeCount,
        recentEmployees,
        employees,
        employeesPercentage,
      },
      leave: {
        leaves,
        leaveCount,
        leaveCounts,
        getApprovedLeaves,
        getPendingLeaves,
        getRejectedLeaves,
        leavesPercentage,
      },
      task: {
        tasks,
        taskCount,
        getTasksThisMonth,
        tasksPercentage,
        totalTasks,
        pendingTasks,
        overdueTasks,
        tasksByPriority,
        completedTask,
        inprogressTasks
      },
      event: {
        events,
        eventCount,
        getEventsThisMonth,
        eventsPercentage,
      },
      payroll: {
        payrolls,
        payrollCount,
        getPayrollHistoryNetpay,
        payrollPercentageChange,
        getTotalDeductions,
        getTotalAllowances,
        totalDeductions,
        totalAllowances,
        averagePayrollAmount,
        payrollGrowthRate,
        budgetComparisonPercentage,
        budget,
        upcomingPayrollDates,
        netPayDistribution,
        netPayDistributionPercentage,
        chartData,
      },
    },
  });
});
