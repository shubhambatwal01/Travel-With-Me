const jwt = require("jsonwebtoken");

const createResponse = (res, statusCode, success, message, data = null) => {
  return res.status(statusCode).json({ success, message, data });
};

exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;
    const ADMIN_USER = process.env.ADMIN_USER || "admin";
    const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "admin123";
    const JWT_SECRET = process.env.JWT_SECRET || "changeme";

    if (!username || !password)
      return createResponse(res, 400, false, "username and password required");

    if (username !== ADMIN_USER || password !== ADMIN_PASSWORD) {
      return createResponse(res, 401, false, "Invalid credentials");
    }

    const token = jwt.sign({ username }, JWT_SECRET, { expiresIn: "8h" });
    return createResponse(res, 200, true, "Login successful", { token });
  } catch (err) {
    return createResponse(res, 500, false, "Login failed", err.message);
  }
};
