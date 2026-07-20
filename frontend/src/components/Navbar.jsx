import { useState } from "react";
import { Menu, X, Bus, Phone, LayoutDashboard, Ticket } from "lucide-react";
import Admin from "../pages/Admin";

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [showAdmin, setShowAdmin] = useState(false);

  return (
    <nav className="sticky border-b border-b-gray-500 bg-slate-900 text-white mb-3">
      <div className="w-full flex justify-baseline px-6 py-8">
        <a href="/" className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-sky-600 text-white shadow-lg">
            <Bus size={24} />
          </div>

          <div>
            <h1 className="text-xl font-bold">Travel With Me</h1>
            <p className="text-xs text-slate-500">Sangamner ↔ Pune</p>
          </div>
        </a>

        {/* Desktop Links */}
        <div className="hidden items-center gap-3 md:flex ml-auto">
          <a
            href="tel:7720995877"
            className="flex items-center gap-2 rounded-xl border border-sky-600 px-4 py-2 font-medium text-sky-600 transition hover:bg-sky-600 hover:text-white"
          >
            <Phone size={18} />
            Call
          </a>

          <a
            href="#booking"
            className="flex items-center gap-2 rounded-xl bg-sky-600 px-5 py-2 font-semibold text-white shadow-md transition hover:bg-sky-700"
          >
            <Ticket size={18} />
            Book Now
          </a>

          <button
            onClick={() => setShowAdmin(true)}
            className="flex items-center gap-2 rounded-xl bg-slate-900 px-5 py-2 font-semibold text-white border transition hover:bg-slate-800"
          >
            <LayoutDashboard size={18} />
            Admin
          </button>
        </div>

        {/* Mobile Humber */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="rounded-lg p-2 text-slate-700 hover:bg-slate-100 md:hidden ml-auto"
        >
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Links */}
      {isOpen && (
        <div className="border-t bg-white md:hidden">
          <div className="space-y-2 px-6 py-5">
            <a
              href="tel:7720995877"
              className="flex items-center gap-2 rounded-lg bg-green-600 px-4 py-3 font-semibold text-white"
            >
              <Phone size={18} />
              Call Now
            </a>

            <a
              href="#booking"
              className="flex items-center gap-2 rounded-lg bg-sky-600 px-4 py-3 font-semibold text-white"
            >
              <Ticket size={18} />
              Book Seat
            </a>

            <button
              onClick={() => setShowAdmin(true)}
              className="flex w-full items-center gap-2 rounded-lg bg-slate-900 px-4 py-3 font-semibold text-white"
            >
              <LayoutDashboard size={18} />
              Admin Dashboard
            </button>
          </div>
        </div>
      )}
      {showAdmin && <Admin onClose={() => setShowAdmin(false)} />}
    </nav>
  );
}

export default Navbar;
