const createResponse = (res, statusCode, success, message, data = null) => {
  return res.status(statusCode).json({ success, message, data });
};

const trips = [
  {
    id: 1,
    from: "Sangamner",
    to: "Pune",
    departureTime: "6:00 AM",
    returnTime: "10:30 AM",
    vehicle: "Ertiga AC",
    available: true,
    contact: ["7745881145"],
  },
];

exports.getHomePage = async (req, res) => {
  res.json({
    success: true,
    message: "Travel With Me API is running.",
    data: {
      trip: "Sangamner to Pune",
      vehicle: "Ertiga AC",
      contacts: ["7720995877", "7385006993"],
    },
  });
};

exports.getTrips = async (req, res) => {
  try {
    return createResponse(res, 200, true, "Trips fetched successfully.", trips);
  } catch (error) {
    return createResponse(
      res,
      500,
      false,
      "Failed to load trips.",
      error.message,
    );
  }
};

exports.createTrip = async (req, res) => {
  try {
    const trip = { id: trips.length + 1, ...req.body };
    trips.push(trip);
    return createResponse(res, 201, true, "Trip added successfully.", trip);
  } catch (error) {
    return createResponse(
      res,
      500,
      false,
      "Trip creation failed.",
      error.message,
    );
  }
};
