import { Bell } from "lucide-react";
import pusher from "@/utils/pusher";
import { useEffect, useState } from "react";

export default function Notification() {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState<{ message: string }[]>([]);
  const unreadCount = notifications.length;

  useEffect(() => {
    const storedNotifications = JSON.parse(
      localStorage.getItem("notifications") || "[]"
    );
    setNotifications(storedNotifications);

    const employeeChannel = pusher.subscribe("employee-channel");
    employeeChannel.bind("new-employee", (data: { message: string }) => {
      const newNotifications = [...notifications, data];
      setNotifications(newNotifications);
      localStorage.setItem("notifications", JSON.stringify(newNotifications));
    });

    const taskChannel = pusher.subscribe("task-channel");
    taskChannel.bind("new-task", (data: { message: string }) => {
      const newNotifications = [...notifications, data];
      setNotifications(newNotifications);
      localStorage.setItem("notifications", JSON.stringify(newNotifications));
    });

    const eventChannel = pusher.subscribe("event-channel");
    eventChannel.bind("new-event", (data: { message: string }) => {
      const newNotifications = [...notifications, data];
      setNotifications(newNotifications);
      localStorage.setItem("notifications", JSON.stringify(newNotifications));
    });

    const payrollChannel = pusher.subscribe("payroll-channel");
    payrollChannel.bind("new-payroll", (data: { message: string }) => {
      const newNotifications = [...notifications, data];
      setNotifications(newNotifications);
      localStorage.setItem("notifications", JSON.stringify(newNotifications));
    });

    return () => {
      pusher.unsubscribe("employee-channel");
      pusher.unsubscribe("task-channel");
      pusher.unsubscribe("event-channel");
      pusher.unsubscribe("payroll-channel");
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleNotificationClick = (index: number) => {
    const updatedNotifications = notifications.filter((_, i) => i !== index);
    setNotifications(updatedNotifications);
    localStorage.setItem("notifications", JSON.stringify(updatedNotifications));
  };

  const clearAllNotifications = () => {
    setNotifications([]);
    localStorage.removeItem("notifications");
  };

  return (
    <>
      <button
        className="relative p-2 hover:bg-base-200 rounded-full transition-colors duration-200 bg-gray-700"
        aria-label="Notifications"
        onClick={() => setOpen(!open)}
      >
        <Bell />
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 inline-flex items-center justify-center w-5 h-5 text-xs font-bold text-black transform translate-x-1/2 -translate-y-1/2 bg-success rounded-full">
            {unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="notification-dropdown">
          {notifications.length > 0 ? (
            <div className="notification-list">
              {notifications.map((notification, index) => (
                <div
                  key={index}
                  className="notification-item"
                  onClick={() => handleNotificationClick(index)}
                >
                  <p className="text-black text-sm">{notification.message}</p>
                </div>
              ))}
              <button
                onClick={clearAllNotifications}
                className="clear-notifications"
              >
                Clear All
              </button>
            </div>
          ) : (
            <p className="text-gray-400 text-sm p-3">No notifications</p>
          )}
        </div>
      )}
    </>
  );
}
