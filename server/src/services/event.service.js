import { uploadToCloudinary } from "../config/cloudinary.js";
import Employee from "../models/employee.js";
import Event from "../models/event.js";
import createHttpError from "http-errors";
import dayjs from "dayjs";
import Notification from "../models/notifications.js";
import pusher from "../config/notification.js";

export const createEventService = async (userId, req) => {
  const employee = await Employee.findById(userId);
  if (!employee) {
    throw new createHttpError(404, "Employee not found");
  }
  let uploadResults;
  if (req.body.photo) {
    const uploadResult = await uploadToCloudinary(req.body.photo, {
      folder: "emplymgmt/events",
    });
    uploadResults = uploadResult;
  }
  const event = await Event.create({
    ...req.body,
    employee: employee._id,
    photo: uploadResults?.url,
    photoId: uploadResults?.public_id,
  });
  pusher.trigger("event-channel", "new-event", {
    eventId: event._id,
    message: `New event created: ${event.title}`,
  });
  const notification = new Notification({
    message: `New event created: ${event.title}`,
    type: "event",
    notificationId: `event-${event._id}`,
  });
  await notification.save();
  await event.save();
  return event;
};

export const trackEventStatus = async (events) => {
  const updatedEvents = await Promise.all(
    events.map(async (event) => {
      const startDateObj = dayjs(event.startDate);
      const endDateObj = dayjs(event.endDate);
      const currentDate = dayjs();
      // Check for cancelled or postponed events
      if (event.status === "cancelled") {
        event.status = "cancelled";
      } else if (event.status === "postponed") {
        event.status = "postponed";
      } else if (
        startDateObj.isSame(currentDate, "day") || // Check if the start date is today
        endDateObj.isSame(currentDate, "day") || // Check if the end date is today
        (startDateObj.isBefore(currentDate, "day") &&
          endDateObj.isAfter(currentDate, "day")) // Ongoing if it started before today and ends after today
      ) {
        event.status = "ongoing";
      } else if (
        startDateObj.isBefore(currentDate, "day") &&
        endDateObj.isBefore(currentDate, "day")
      ) {
        event.status = "past";
      } else if (endDateObj.isBefore(currentDate, "day")) {
        event.status = "past";
      } else {
        event.status = "upcoming";
      }

      await event.save(); // Save the updated event status
      return event;
    })
  );

  return updatedEvents; // Return the updated events
};

export const updateEventService = async (event, req) => {
  if (event.photoId) {
    await deleteFromCloudinary(event.photoId);
  }
  let uploadResults;
  if (req.body.photo) {
    const uploadResult = await uploadToCloudinary(req.body.photo, {
      folder: "emplymgmt/events",
    });
    uploadResults = uploadResult;
  }

  const updatedFields = {
    ...req.body,
    photo: uploadResults?.url,
    photoId: uploadResults?.public_id,
  };

  Object.keys(updatedFields).forEach((key) => {
    if (
      updatedFields[key] === "" ||
      updatedFields[key] === null ||
      updatedFields[key] === undefined
    ) {
      delete updatedFields[key];
    }
  });
  const updatedEvent = await Event.findOneAndUpdate(
    { _id: event._id },
    { ...updatedFields },
    { new: true }
  );
  return updatedEvent;
};
