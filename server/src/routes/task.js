import { Router } from "express";
import {
  createTask,
  getTasks,
  getTask,
  updateTask,
} from "../controllers/task.js";
import { verifyAuth, Roles } from "../middleware.js/verifyAuth.js";
const router = Router();

router.post("/create", verifyAuth(Roles.Admin), createTask);
router.get("/", verifyAuth(Roles.All), getTasks);
router.get("/:id", verifyAuth(Roles.All), getTask);
router.patch("/:id/update", verifyAuth(Roles.Admin), updateTask);
export default router;
