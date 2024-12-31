import Pusher from "pusher-js";

const pusher = new Pusher(import.meta.env.VITE_PUSHER_APP, {
  cluster: import.meta.env.VITE_PUSHER_APP_CLUSTER,
});

const employeeChannel = pusher.subscribe("employee-channel");
employeeChannel.bind("new-employee", function (data: unknown) {
  console.log("New employee created:", data);
});

const taskChannel = pusher.subscribe("task-channel");
taskChannel.bind("new-task", function (data: unknown) {
  console.log("New task created:", data);
});
const eventChannel = pusher.subscribe("event-channel");
eventChannel.bind("new-event", function (data: unknown) {
  console.log("New event created:", data);
});
const payrollChannel = pusher.subscribe("payroll-channel");
payrollChannel.bind("new-payroll", function (data: unknown) {
  console.log("New payroll created:", data);
});

export default pusher;
