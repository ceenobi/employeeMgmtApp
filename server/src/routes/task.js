import { Router } from "express";
import {
  createTask,
  getTasks,
  getTask,
  updateTask,
  deleteTask,
  searchTasks,
  updateTaskStatus,
} from "../controllers/task.js";
import { verifyAuth, Roles } from "../middleware.js/verifyAuth.js";
import { cacheMiddleware } from "../config/cache.js";

const router = Router();

router.post("/create", verifyAuth(Roles.Admin), createTask);
router.get(
  "/",
  verifyAuth(Roles.All),
  cacheMiddleware("getTasks", 300),
  getTasks
);
router.get(
  "/search",
  verifyAuth(Roles.All),
  cacheMiddleware("getTasks", 300),
  searchTasks
);
router.get(
  "/:id",
  verifyAuth(Roles.All),
  cacheMiddleware("getTask", 300),
  getTask
);
router.patch("/:id/update", verifyAuth(Roles.Admin), updateTask);
router.delete("/delete/:id", verifyAuth(Roles.Admin), deleteTask);
router.patch("/update-status/:id", verifyAuth(Roles.Admin), updateTaskStatus);
export default router;
