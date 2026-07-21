import { ArrowRight, Phone, MapPin, Clock, Users } from "lucide-react";
import heroCar from "../assets/car.jpg";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

function HomePage() {
  return (
    <>
      <Navbar />
      <section
        className="min-h-screen relative h-[90vh] bg-cover bg-center"
        style={{ backgroundImage: `url(${heroCar})` }}
      >
        <div className="absolute inset-0 bg-black/60"></div>

        <div className="relative mx-auto flex h-full max-w-7xl items-center px-6">
          <div className="max-w-2xl text-white">
            <h1 className="mt-6 text-5xl font-extrabold leading-tight md:text-6xl">
              Travel Comfortably
              <br />
              <span className="text-sky-400">Sangamner ↔ Pune</span>
            </h1>

            <p className="mt-6 text-lg text-slate-200">
              Book your comfortable AC ride with professional drivers,
              affordable fares and guaranteed safety.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <a
                href="/booking"
                className="flex items-center gap-2 rounded-xl bg-sky-600 px-6 py-3 font-semibold transition hover:bg-sky-700"
              >
                Book Your Seat
                <ArrowRight size={18} />
              </a>

              <a
                href="tel:7720995877"
                className="flex items-center gap-2 rounded-xl border border-white px-6 py-3 font-semibold transition hover:bg-white hover:text-black"
              >
                <Phone size={18} />
                Call Now
              </a>
            </div>

            <div className="mt-12 grid gap-4 sm:grid-cols-3">
              <div className="rounded-2xl bg-white/10 p-4 backdrop-blur-md">
                <MapPin className="mb-2 text-sky-400" size={28} />
                <h3 className="font-semibold">Route</h3>
                <p className="text-sm text-slate-200">Sangamner → Pune</p>
              </div>

              <div className="rounded-2xl bg-white/10 p-4 backdrop-blur-md">
                <Clock className="mb-2 text-sky-400" size={28} />
                <h3 className="font-semibold">Departure</h3>
                <p className="text-sm text-slate-200">6:00 AM Daily</p>
              </div>

              <div className="rounded-2xl bg-white/10 p-4 backdrop-blur-md">
                <Users className="mb-2 text-sky-400" size={28} />
                <h3 className="font-semibold">Passengers</h3>
                <p className="text-sm text-slate-200">Safe & Comfortable</p>
              </div>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
}

export default HomePage;
