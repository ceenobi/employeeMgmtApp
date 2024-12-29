import { Router } from "express";
import {
  createEvent,
  deleteEvent,
  getAllEvents,
  getEvent,
  updateEvent,
} from "../controllers/event.js";
import { verifyAuth, Roles } from "../middleware.js/verifyAuth.js";
import { cacheMiddleware } from "../config/cache.js";

const router = Router();

router.post("/create", verifyAuth(Roles.All), createEvent);
router.get(
  "/",
  verifyAuth(Roles.All),
  cacheMiddleware("events", 300),
  getAllEvents
);
router.get(
  "/:id",
  verifyAuth(Roles.All),
  cacheMiddleware("single-event", 300),
  getEvent
);
router.patch("/:id/update", verifyAuth(Roles.All), updateEvent);
router.delete("/delete/:id", verifyAuth(Roles.All), deleteEvent);
export default router;
