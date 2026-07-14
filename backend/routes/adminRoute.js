const express = require("express");
const adminRouter = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const authController = require("../controllers/authController");

const adminController = require("../controllers/adminController");

adminRouter.get("/admin", authMiddleware, adminController.getAdminDashboard);
adminRouter.post("/auth/login", authController.login);

adminRouter.get(
  "/admin/bookings",
  authMiddleware,
  adminController.listBookings,
);
adminRouter.post(
  "/admin/bookings/:id/confirm",
  authMiddleware,
  adminController.confirmBooking,
);
adminRouter.post(
  "/admin/bookings/:id/reject",
  authMiddleware,
  adminController.rejectBooking,
);
adminRouter.get(
  "/admin/bookings/export",
  authMiddleware,
  adminController.exportBookings,
);

module.exports = adminRouter;
