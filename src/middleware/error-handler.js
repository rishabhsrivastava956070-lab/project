const { ApiError } = require("../utils/api-error");

function errorHandler(error, _req, res, _next) {
  if (error.name === "JsonWebTokenError" || error.name === "TokenExpiredError") {
    return res.status(401).json({ success: false, message: "Invalid or expired token" });
  }

  if (error.code === "23505") {
    return res.status(409).json({ success: false, message: "Record already exists" });
  }

  if (error instanceof ApiError) {
    return res.status(error.statusCode).json({
      success: false,
      message: error.message,
      details: error.details,
    });
  }

  console.error(error);
  return res.status(500).json({
    success: false,
    message: "Something went wrong",
  });
}

module.exports = { errorHandler };
