const authService = require("./auth.service");

async function register(req, res) {
  const data = await authService.register(req.body);
  res.status(201).json({ success: true, message: "Registration successful", data });
}

async function login(req, res) {
  const data = await authService.login(req.body);
  res.status(200).json({ success: true, message: "Login successful", data });
}

async function me(req, res) {
  res.status(200).json({ success: true, data: { user: req.user } });
}

module.exports = { register, login, me };
