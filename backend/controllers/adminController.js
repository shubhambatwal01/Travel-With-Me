const Booking = require("../models/Booking");

const createResponse = (res, statusCode, success, message, data = null) => {
  return res.status(statusCode).json({ success, message, data });
};

exports.getAdminDashboard = async (req, res) => {
  try {
    const total = await Booking.countDocuments();
    const pending = await Booking.countDocuments({ status: "pending" });
    const confirmed = await Booking.countDocuments({ status: "confirmed" });
    const rejected = await Booking.countDocuments({ status: "rejected" });

    return createResponse(res, 200, true, "Admin dashboard loaded.", {
      totalBookings: total,
      pendingBookings: pending,
      confirmedBookings: confirmed,
      rejectedBookings: rejected,
    });
  } catch (error) {
    return createResponse(
      res,
      500,
      false,
      "Failed to load admin dashboard.",
      error.message,
    );
  }
};

exports.listBookings = async (req, res) => {
  try {
    const { search, status, page = 1, limit = 20 } = req.query;
    const filter = {};
    if (status) filter.status = status;
    if (search) {
      filter.$or = [
        { name: new RegExp(search, "i") },
        { phone: new RegExp(search, "i") },
      ];
    }

    const pageNum = parseInt(page, 10) || 1;
    const perPage = Math.min(parseInt(limit, 10) || 20, 100);

    const total = await Booking.countDocuments(filter);
    const bookings = await Booking.find(filter)
      .sort({ createdAt: -1 })
      .skip((pageNum - 1) * perPage)
      .limit(perPage)
      .lean();

    return createResponse(res, 200, true, "Bookings listed.", {
      bookings,
      page: pageNum,
      perPage,
      total,
    });
  } catch (error) {
    return createResponse(
      res,
      500,
      false,
      "Failed to list bookings.",
      error.message,
    );
  }
};

exports.confirmBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const booking = await Booking.findByIdAndUpdate(
      id,
      { status: "confirmed" },
      { returnDocument: "after" },
    ).lean();
    if (!booking) return createResponse(res, 404, false, "Booking not found.");
    return createResponse(res, 200, true, "Booking confirmed.", booking);
  } catch (error) {
    return createResponse(
      res,
      500,
      false,
      "Failed to confirm booking.",
      error.message,
    );
  }
};

exports.rejectBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const booking = await Booking.findByIdAndUpdate(
      id,
      { status: "rejected" },
      { returnDocument: "after" },
    ).lean();
    if (!booking) return createResponse(res, 404, false, "Booking not found.");
    return createResponse(res, 200, true, "Booking rejected.", booking);
  } catch (error) {
    return createResponse(
      res,
      500,
      false,
      "Failed to reject booking.",
      error.message,
    );
  }
};

exports.exportBookings = async (req, res) => {
  try {
    const { date } = req.query; // optional filter by date
    const filter = {};
    if (date) {
      const start = new Date(date);
      start.setHours(0, 0, 0, 0);
      const end = new Date(date);
      end.setHours(23, 59, 59, 999);
      filter.createdAt = { $gte: start, $lte: end };
    }

    const bookings = await Booking.find(filter).sort({ createdAt: -1 }).lean();

    // Build CSV
    const headers = [
      "Name",
      "Phone",
      "Route",
      "TravelDate",
      "Pickup",
      "Drop",
      "Seats",
      "Status",
      "Notes",
      "CreatedAt",
    ];
    const rows = bookings.map((b) => [
      b.name,
      b.phone,
      `${b.from} -> ${b.to}`,
      b.travelDate ? new Date(b.travelDate).toLocaleDateString() : "",
      b.pickupLocation || "",
      b.dropLocation || "",
      b.seats || "",
      b.status || "",
      (b.notes || "").replace(/\r?\n|,/g, " "),
      new Date(b.createdAt).toLocaleString(),
    ]);

    const csv = [
      headers.join(","),
      ...rows.map((r) =>
        r.map((v) => `"${String(v).replace(/"/g, '""')}"`).join(","),
      ),
    ].join("\n");

    res.setHeader("Content-Type", "text/csv");
    res.setHeader("Content-Disposition", 'attachment; filename="bookings.csv"');
    return res.send(csv);
  } catch (error) {
    return createResponse(
      res,
      500,
      false,
      "Failed to export bookings.",
      error.message,
    );
  }
};
