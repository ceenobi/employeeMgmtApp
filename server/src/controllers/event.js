import Event from "../models/event.js";
import createHttpError from "http-errors";
import { isValidObjectId } from "mongoose";
import tryCatch from "../utils/tryCatchFn.js";
import { validateEvent } from "../utils/validators.js";
import {
  createEventService,
  trackEventStatus,
  updateEventService,
} from "../services/event.service.js";
import { clearCache } from "../config/cache.js";
import { deleteFromCloudinary } from "../config/cloudinary.js";

export const createEvent = tryCatch(async (req, res, next) => {
  const { error } = validateEvent(req.body);
  if (error) return next(createHttpError(400, error.details[0].message));
  const { id: userId } = req.user;
  const event = await createEventService(userId, req);
  clearCache("events");
  res.status(201).json({
    msg: "Event created successfully",
    event,
  });
});

export const getAllEvents = tryCatch(async (req, res, next) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;
  const events = await Event.find()
    .populate("employee", "firstName lastName photo")
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);
  if (!events) {
    return next(createHttpError(404, "No events found"));
  }
  await trackEventStatus(events);
  const totalCount = await Event.countDocuments();
  res.status(200).json({
    success: true,
    message: "Events fetched successfully",
    events,
    pagination: {
      currentPage: page,
      totalPages: Math.ceil(totalCount / limit),
      totalEvents: totalCount,
      hasMore: skip + events.length < totalCount,
    },
  });
});

export const getEvent = tryCatch(async (req, res, next) => {
  const { id: eventId } = req.params;
  if (!eventId || !isValidObjectId(eventId)) {
    return next(createHttpError(400, "Event id is required"));
  }
  const event = await Event.findById(eventId).populate(
    "employee",
    "firstName lastName photo"
  );
  if (!event) {
    return next(createHttpError(404, "Event not found"));
  }
  res.status(200).json({
    success: true,
    message: "Event fetched successfully",
    event,
  });
});

export const updateEvent = tryCatch(async (req, res, next) => {
  const { id: userId } = req.user;
  const { id: eventId } = req.params;
  if (!eventId) return next(createHttpError(400, "Event id is required"));
  const event = await Event.findById(eventId);
  if (!event) {
    return next(createHttpError(404, "Event not found"));
  }
  if (event.employee.toString() !== userId) {
    return next(
      createHttpError(403, "You are not authorized to update this task")
    );
  }
  clearCache("events");
  const updatedEvent = await updateEventService(event, req);
  res.status(200).json({
    msg: "Event updated successfully",
    event: updatedEvent,
  });
});

export const deleteEvent = tryCatch(async (req, res, next) => {
  const { id: eventId } = req.params;
  if (!eventId) return next(createHttpError(400, "Event id is required"));
  const event = await Event.findByIdAndDelete(eventId);
  if (!event) {
    return next(createHttpError(404, "Event not found"));
  }
  if (event.photoId) {
    await deleteFromCloudinary(event.photoId);
  }
  clearCache("events");
  res.status(200).json({ msg: "Event deleted successfully" });
});
