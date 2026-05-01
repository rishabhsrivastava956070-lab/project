const { Router } = require("express");
const controller = require("./task.controller");
const { authenticate } = require("../../middleware/auth");
const { validate } = require("../../middleware/validate");
const { asyncHandler } = require("../../utils/async-handler");
const {
  createTaskSchema,
  updateTaskSchema,
  taskIdSchema,
  listTaskSchema,
} = require("./task.schemas");

const taskRouter = Router();

taskRouter.use(authenticate);
taskRouter.get("/", validate(listTaskSchema), asyncHandler(controller.listTasks));
taskRouter.post("/", validate(createTaskSchema), asyncHandler(controller.createTask));
taskRouter.get("/:id", validate(taskIdSchema), asyncHandler(controller.getTask));
taskRouter.patch("/:id", validate(updateTaskSchema), asyncHandler(controller.updateTask));
taskRouter.delete("/:id", validate(taskIdSchema), asyncHandler(controller.deleteTask));

module.exports = { taskRouter };
