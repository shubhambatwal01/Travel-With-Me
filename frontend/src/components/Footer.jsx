function Footer() {
  return (
    <footer className="bg-slate-900 text-white">
      <div className="mx-auto max-w-4xl px-6 py-3">
        <div className="flex flex-col items-center justify-between gap-4 text-center text-sm text-slate-400 md:flex-row">
          <p>
            © {new Date().getFullYear()} Travel With Me. All Rights Reserved.
          </p>

          <p>
            Designed & Developed by
            <span className="ml-1 font-semibold text-sky-400">
              Shubham Batwal
            </span>
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
