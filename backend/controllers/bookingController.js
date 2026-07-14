const createResponse = (res, statusCode, success, message, data = null) => {
  return res.status(statusCode).json({ success, message, data });
};

const Booking = require("../models/Booking");

exports.createBooking = async (req, res) => {
  try {
    const {
      name,
      phone,
      from,
      to,
      departureTime,
      returnTime,
      vehicle,
      seats,
      pickupLocation,
      dropLocation,
      travelDate,
      notes,
    } = req.body;

    if (!name || !phone || !from || !to) {
      return createResponse(
        res,
        400,
        false,
        "Please provide name, phone, route.",
      );
    }

    const booking = await Booking.create({
      name,
      phone,
      from,
      to,
      departureTime,
      returnTime,
      vehicle,
      seats: seats || 1,
      pickupLocation,
      dropLocation,
      travelDate: travelDate ? new Date(travelDate) : undefined,
      notes,
    });

    return createResponse(
      res,
      201,
      true,
      "Booking created successfully.",
      booking,
    );
  } catch (error) {
    return createResponse(
      res,
      500,
      false,
      "Booking creation failed.",
      error.message,
    );
  }
};

exports.getBookings = async (req, res) => {
  try {
    const { search, status } = req.query;
    const filter = {};
    if (status) filter.status = status;
    if (search) {
      filter.$or = [
        { name: new RegExp(search, "i") },
        { phone: new RegExp(search, "i") },
      ];
    }

    const bookings = await Booking.find(filter).sort({ createdAt: -1 }).lean();
    return createResponse(
      res,
      200,
      true,
      "Bookings retrieved successfully.",
      bookings,
    );
  } catch (error) {
    return createResponse(
      res,
      500,
      false,
      "Unable to fetch bookings.",
      error.message,
    );
  }
};
