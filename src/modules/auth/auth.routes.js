const { Router } = require("express");
const controller = require("./auth.controller");
const { validate } = require("../../middleware/validate");
const { authenticate } = require("../../middleware/auth");
const { asyncHandler } = require("../../utils/async-handler");
const { registerSchema, loginSchema } = require("./auth.schemas");

const authRouter = Router();

authRouter.post("/register", validate(registerSchema), asyncHandler(controller.register));
authRouter.post("/login", validate(loginSchema), asyncHandler(controller.login));
authRouter.get("/me", authenticate, asyncHandler(controller.me));

module.exports = { authRouter };
