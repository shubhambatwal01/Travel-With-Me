import { useState } from "react";
import { Menu, X, Bus, Phone, LayoutDashboard, Ticket } from "lucide-react";
import Admin from "../pages/Admin";

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [showAdmin, setShowAdmin] = useState(false);

  return (
    <nav className="sticky border-b-gray-500 bg-slate-900 text-white">
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

        <div className="items-center gap-3 md:flex ml-auto">
          <button
            onClick={() => setShowAdmin(true)}
            className="flex items-center gap-2 rounded-xl bg-slate-900 px-5 py-2 font-semibold text-white border transition hover:bg-slate-800"
          >
            <LayoutDashboard size={18} />
            Admin
          </button>
        </div>
      </div>
      {showAdmin && <Admin onClose={() => setShowAdmin(false)} />}
    </nav>
  );
}

export default Navbar;
