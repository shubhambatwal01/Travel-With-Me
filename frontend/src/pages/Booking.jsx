import { useEffect, useState } from "react";
import axios from "axios";
import { QRCodeCanvas } from "qrcode.react";
import ContactUs from "../components/ContactUs";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import heroCar from "../assets/car.jpg";

function Booking() {
  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    from: "Sangamner",
    to: "Pune",
    travelDate: "",
    departureTime: "6:00 AM",
    returnTime: "10:30 AM",
    vehicle: "Ertiga AC",
    seats: 1,
    pickupLocation: "",
    dropLocation: "",
    notes: "",
  });
  const [statusMessage, setStatusMessage] = useState("");
  const [bookingCreated, setBookingCreated] = useState(null);
  const [paymentStatus, setPaymentStatus] = useState("");
  const [showUpi, setShowUpi] = useState(false);
  const farePerSeat = 350;
  const upiId = "7720995877@paytm";
  const payeeName = "Travel With Me";
  const totalAmount = bookingCreated
    ? bookingCreated.seats * farePerSeat
    : formData.seats * farePerSeat;
  const upiQrValue = `upi://pay?pa=${upiId}&pn=${encodeURIComponent(payeeName)}&am=${totalAmount}&cu=INR`;

  useEffect(() => {
    const fetchTrip = async () => {
      try {
        const response = await axios.get("http://localhost:1101/trips");
        const tripData = response.data?.data?.[0];
        setTrip(tripData || null);
      } catch (error) {
        console.error("Failed to fetch trip", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTrip();
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "seats" ? parseInt(value, 10) || 1 : value,
    }));
  };

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      if (window.Razorpay) {
        return resolve(true);
      }

      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setStatusMessage("");
    setBookingCreated(null);
    setPaymentStatus("");
    setShowUpi(false);

    try {
      const response = await axios.post(
        "http://localhost:1101/bookings",
        formData,
      );
      if (response.data?.success) {
        setBookingCreated(response.data.data);
        setStatusMessage(
          `Booking created successfully for ${formData.name}. Choose a payment option below.`,
        );
        setFormData((prev) => ({ ...prev, name: "", phone: "", seats: 1 }));
      } else {
        setStatusMessage("Booking could not be completed.");
      }
    } catch (error) {
      console.error("Booking failed", error);
      setStatusMessage("Booking failed. Please try again.");
    }
  };

  const handleOpenWhatsApp = () => {
    if (!bookingCreated) return;
    const contactNumber =
      (trip && trip.contact && trip.contact[0]) || "7745881145";
    const message = `Name: ${bookingCreated.name}\nMobile: ${bookingCreated.phone}\nRoute: ${bookingCreated.from} -> ${bookingCreated.to}\nDate: ${bookingCreated.travelDate ? new Date(bookingCreated.travelDate).toLocaleDateString() : ""}\nPassengers: ${bookingCreated.seats}\nPickup: ${bookingCreated.pickupLocation || ""}\nDrop: ${bookingCreated.dropLocation || ""}`;
    window.open(
      `https://wa.me/${contactNumber}?text=${encodeURIComponent(message)}`,
    );
  };

  const handleRazorpayPayment = async () => {
    if (!bookingCreated) {
      setPaymentStatus("Please create the booking first before paying.");
      return;
    }

    const scriptLoaded = await loadRazorpayScript();
    if (!scriptLoaded) {
      setPaymentStatus(
        "Unable to load Razorpay checkout. Please try again later.",
      );
      return;
    }

    try {
      const amount = bookingCreated.seats * farePerSeat;
      const paymentResponse = await axios.post(
        "http://localhost:1101/payments",
        {
          bookingId: bookingCreated._id,
          amount,
        },
      );

      if (!paymentResponse.data?.success) {
        setPaymentStatus("Unable to create payment order. Please try again.");
        return;
      }

      const { order, key_id } = paymentResponse.data.data;
      const options = {
        key: key_id,
        amount: order.amount,
        currency: order.currency,
        name: "Travel With Me",
        description: `Booking payment for ${bookingCreated.seats} passenger(s)`,
        order_id: order.id,
        handler: function (response) {
          setPaymentStatus("Payment completed successfully. Thank you!");
        },
        modal: {
          ondismiss: function () {
            setPaymentStatus(
              "Razorpay payment dismissed. You can try again or choose UPI.",
            );
          },
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error) {
      console.error("Payment setup failed", error);
      setPaymentStatus("Payment failed. Please try again.");
    }
  };
  return (
    <>
      <Navbar />
      <div
        className="min-h-screen bg-cover bg-center py-3"
        style={{ backgroundImage: `url(${heroCar})` }}
      >
        <div className="min-h-screen mx-auto flex max-w-5xl flex-col gap-6 items-center justify-center">
          {loading ? (
            <div className="rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-md">
              Loading trip details...
            </div>
          ) : trip ? (
            <section className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
              <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-md">
                <div className="flex items-center justify-between">
                  <span className="rounded-full bg-emerald-100 px-3 py-1 text-sm font-semibold text-emerald-700">
                    Passenger booking available
                  </span>
                  <span className="text-sm font-medium text-slate-500">
                    {trip.vehicle}
                  </span>
                </div>

                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                  <div className="rounded-2xl bg-slate-50 p-4">
                    <p className="text-sm font-semibold uppercase tracking-[0.25em] text-slate-500">
                      Route
                    </p>
                    <p className="mt-2 text-xl font-bold">
                      {trip.from} → {trip.to}
                    </p>
                  </div>
                  <div className="rounded-2xl bg-slate-50 p-4">
                    <p className="text-sm font-semibold uppercase tracking-[0.25em] text-slate-500">
                      Departure
                    </p>
                    <p className="mt-2 text-xl font-bold">
                      {trip.departureTime}
                    </p>
                  </div>
                  <div className="rounded-2xl bg-slate-50 p-4">
                    <p className="text-sm font-semibold uppercase tracking-[0.25em] text-slate-500">
                      Return
                    </p>
                    <p className="mt-2 text-xl font-bold">{trip.returnTime}</p>
                  </div>
                  <div className="rounded-2xl bg-slate-50 p-4">
                    <p className="text-sm font-semibold uppercase tracking-[0.25em] text-slate-500">
                      Contacts
                    </p>
                    <p className="mt-2 text-xl font-bold">
                      {trip.contact?.join(" • ")}
                    </p>
                  </div>
                </div>

                <div className="mt-8">
                  <h2 className="text-2xl font-bold mb-3">Booking Form</h2>
                  <form className="grid gap-3" onSubmit={handleSubmit}>
                    <div className="grid gap-2 sm:grid-cols-2">
                      <input
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        placeholder="Full name"
                        className="rounded-2xl border border-slate-300 px-4 py-3"
                      />
                      <input
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        required
                        placeholder="Mobile number"
                        className="rounded-2xl border border-slate-300 px-4 py-3"
                      />
                    </div>
                    <div className="grid gap-2 sm:grid-cols-2">
                      <input
                        name="pickupLocation"
                        value={formData.pickupLocation}
                        onChange={handleChange}
                        placeholder="Pickup location"
                        className="rounded-2xl border border-slate-300 px-4 py-3"
                      />
                      <input
                        name="dropLocation"
                        value={formData.dropLocation}
                        onChange={handleChange}
                        placeholder="Drop location"
                        className="rounded-2xl border border-slate-300 px-4 py-3"
                      />
                    </div>
                    <div className="grid gap-2 sm:grid-cols-2">
                      <input
                        name="travelDate"
                        type="date"
                        value={formData.travelDate}
                        onChange={handleChange}
                        className="rounded-2xl border border-slate-300 px-4 py-3"
                      />
                      <select
                        name="seats"
                        value={formData.seats}
                        onChange={handleChange}
                        className="rounded-2xl border border-slate-300 px-4 py-3"
                      >
                        <option value={1}>1 passenger</option>
                        <option value={2}>2 passengers</option>
                        <option value={3}>3 passengers</option>
                        <option value={4}>4 passengers</option>
                      </select>
                    </div>
                    <select
                      name="from"
                      value={formData.from}
                      onChange={handleChange}
                      className="rounded-2xl border border-slate-300 px-4 py-3"
                    >
                      <option value="Sangamner">Sangamner → Pune</option>
                      <option value="Pune">Pune → Sangamner</option>
                    </select>
                    <textarea
                      name="notes"
                      value={formData.notes}
                      onChange={handleChange}
                      placeholder="Special notes (optional)"
                      className="rounded-2xl border border-slate-300 px-4 py-3"
                    />

                    <button className="rounded-2xl bg-sky-600 px-4 py-3 font-semibold text-white hover:bg-sky-700">
                      Create booking
                    </button>
                  </form>

                  {statusMessage ? (
                    <p className="mt-3 text-sm text-emerald-700">
                      {statusMessage}
                    </p>
                  ) : null}

                  {bookingCreated ? (
                    <div className="mt-6 rounded-3xl border border-emerald-200 bg-emerald-50 p-5">
                      <h3 className="text-xl font-semibold">
                        Next step: pay or confirm by WhatsApp
                      </h3>
                      <p className="mt-2 text-sm text-slate-600">
                        Total amount: ₹{bookingCreated.seats * farePerSeat}
                      </p>
                      <div className="mt-4 flex flex-col gap-3 sm:flex-row">
                        <button
                          onClick={handleRazorpayPayment}
                          className="rounded-2xl bg-amber-500 px-4 py-3 font-semibold text-slate-900 hover:bg-amber-600"
                        >
                          Pay with Razorpay
                        </button>
                        <button
                          onClick={() => setShowUpi((prev) => !prev)}
                          className="rounded-2xl bg-slate-900 px-4 py-3 font-semibold text-white hover:bg-slate-800"
                        >
                          {showUpi ? "Hide UPI QR" : "Pay via UPI"}
                        </button>
                        <button
                          onClick={handleOpenWhatsApp}
                          className="rounded-2xl bg-sky-600 px-4 py-3 font-semibold text-white hover:bg-sky-700"
                        >
                          Send WhatsApp booking
                        </button>
                      </div>
                      {paymentStatus ? (
                        <p className="mt-3 text-sm text-slate-700">
                          {paymentStatus}
                        </p>
                      ) : null}
                      {showUpi ? (
                        <div className="mt-6 rounded-3xl bg-white p-4 shadow-inner">
                          <p className="mb-3 text-sm text-slate-500">
                            Scan this UPI QR to pay ₹
                            {bookingCreated.seats * farePerSeat}:
                          </p>
                          <div className="mx-auto w-48">
                            <QRCodeCanvas
                              value={upiQrValue}
                              size={192}
                              bgColor="#ffffff"
                              fgColor="#111827"
                            />
                          </div>
                          <p className="mt-3 text-sm text-slate-600">
                            UPI ID:{" "}
                            <span className="font-semibold">{upiId}</span>
                          </p>
                        </div>
                      ) : null}
                    </div>
                  ) : null}
                </div>
              </div>
              <>
                <ContactUs />
              </>
            </section>
          ) : (
            <div className="rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-md">
              No trip information available right now.
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}

export default Booking;
