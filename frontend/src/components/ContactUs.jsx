import { useState } from "react";

function ContactUs() {
  return (
    <div className="h-fit rounded-3xl border border-slate-200 bg-white p-8 shadow-md">
      <h2 className="text-2xl font-bold">Call for booking</h2>
      <div className="mt-6 space-y-3">
        <a
          href="tel:774581145"
          className="flex items-center justify-between rounded-2xl bg-slate-900 px-4 py-3 text-white"
        >
          📞 7745881145
          <span className="text-sm text-slate-300">Call now</span>
        </a>
      </div>
    </div>
  );
}

export default ContactUs;
