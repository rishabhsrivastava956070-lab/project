const { Router } = require("express");
const { authRouter } = require("../modules/auth/auth.routes");
const { taskRouter } = require("../modules/tasks/task.routes");
const { userRouter } = require("../modules/users/user.routes");

const apiRouter = Router();

apiRouter.use("/auth", authRouter);
apiRouter.use("/tasks", taskRouter);
apiRouter.use("/users", userRouter);

module.exports = { apiRouter };
