const express = require("express");
const userRouter = express.Router();

const tripController = require("../controllers/tripController");
const bookingController = require("../controllers/bookingController");

userRouter.get("/", tripController.getHomePage);

userRouter.get("/trips", tripController.getTrips);
userRouter.post("/trips", tripController.createTrip);

userRouter.post("/bookings", bookingController.createBooking);
userRouter.get("/bookings", bookingController.getBookings);

module.exports = userRouter;