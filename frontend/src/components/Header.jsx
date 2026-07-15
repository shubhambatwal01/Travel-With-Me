import { useState } from "react";
import Admin from "../pages/Admin";

function Header() {
  const [showAdmin, setShowAdmin] = useState(false);
  return (
    <header className="rounded-3xl bg-slate-900 p-8 text-white shadow-xl">
      <p className="mb-3 text-sm uppercase tracking-[0.35em] text-sky-300">
        Travel With Me
      </p>
      <div className="flex items-center justify-between">
        <h1 className="text-4xl font-bold sm:text-5xl">
          Sangamner ↔ Pune Passenger Service
        </h1>
        <div>
          <button
            onClick={() => setShowAdmin(true)}
            className="rounded bg-slate-200 px-3 py-2 text-slate-900"
          >
            Admin Dashboard
          </button>
        </div>
      </div>
      <p className="mt-4 max-w-2xl text-lg text-slate-300">
        Comfortable AC Ertiga service. Safe. Reliable. On time.
      </p>
      {showAdmin && <Admin onClose={() => setShowAdmin(false)} />}
    </header>
  );
}

export default Header;
