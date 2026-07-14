const mongoose = require("mongoose");

const BookingSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true },
  from: { type: String, required: true },
  to: { type: String, required: true },
  travelDate: { type: Date },
  departureTime: { type: String },
  returnTime: { type: String },
  vehicle: { type: String },
  seats: { type: Number, default: 1 },
  pickupLocation: { type: String },
  dropLocation: { type: String },
  notes: { type: String },
  status: {
    type: String,
    enum: ["pending", "confirmed", "rejected"],
    default: "pending",
  },
  amountPaid: { type: Number, default: 0 },
  createdAt: { type: Date, default: () => new Date() },
});

module.exports = mongoose.model("Booking", BookingSchema);
