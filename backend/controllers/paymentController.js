const createResponse = (res, statusCode, success, message, data = null) => {
  return res.status(statusCode).json({ success, message, data });
};

const Razorpay = require("razorpay");
const Booking = require("../models/Booking");

exports.makePayment = async (req, res) => {
  try {
    const { bookingId, amount, currency = "INR" } = req.body;

    if (!bookingId || !amount) {
      return createResponse(
        res,
        400,
        false,
        "Booking ID and amount are required.",
      );
    }

    const instance = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID || "",
      key_secret: process.env.RAZORPAY_KEY_SECRET || "",
    });

    const options = {
      amount: Math.round(amount * 100), // in paise
      currency,
      receipt: `booking_${bookingId}_${Date.now()}`,
    };

    const order = await instance.orders.create(options);

    // store order id against booking (optional)
    await Booking.findByIdAndUpdate(bookingId, { razorpayOrderId: order.id });

    return createResponse(res, 200, true, "Razorpay order created.", {
      order,
      key_id: process.env.RAZORPAY_KEY_ID || "",
    });
  } catch (error) {
    return createResponse(res, 500, false, "Payment failed.", error.message);
  }
};
