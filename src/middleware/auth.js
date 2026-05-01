const { query } = require("../config/db");
const { ApiError } = require("../utils/api-error");
const { asyncHandler } = require("../utils/async-handler");
const { verifyAccessToken } = require("../utils/jwt");

const authenticate = asyncHandler(async (req, _res, next) => {
  const header = req.headers.authorization;
  const token = header?.startsWith("Bearer ") ? header.slice(7) : null;

  if (!token) {
    throw new ApiError(401, "Authentication token is required");
  }

  const payload = verifyAccessToken(token);
  const result = await query(
    `SELECT id, name, email, role, created_at AS "createdAt"
     FROM users
     WHERE id = $1`,
    [payload.sub]
  );
  const user = result.rows[0];

  if (!user) {
    throw new ApiError(401, "User no longer exists");
  }

  req.user = user;
  next();
});

const authorize = (...roles) => (req, _res, next) => {
  if (!roles.includes(req.user.role)) {
    return next(new ApiError(403, "You do not have permission to perform this action"));
  }
  next();
};

module.exports = { authenticate, authorize };
