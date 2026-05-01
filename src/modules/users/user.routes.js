const { Router } = require("express");
const { authenticate, authorize } = require("../../middleware/auth");
const { asyncHandler } = require("../../utils/async-handler");
const controller = require("./user.controller");

const userRouter = Router();

userRouter.get("/", authenticate, authorize("ADMIN"), asyncHandler(controller.listUsers));

module.exports = { userRouter };
