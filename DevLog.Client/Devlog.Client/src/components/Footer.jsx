function Footer() {
  return (
    <footer className="border-t border-zinc-800 mt-20">
      <div className="max-w-5xl mx-auto px-4 py-12 text-center">
        <h3 className="text-lg font-semibold mb-4 bg-linear-to-r from-emerald-400 to-indigo-500 bg-clip-text text-transparent">
          DevLog
        </h3>

        <p className="text-zinc-500 text-sm max-w-md mx-auto">
          A focused platform for developers to document their journey, publish
          technical insights, and grow publicly.
        </p>

        <div className="mt-6 text-zinc-600 text-sm">
          © {new Date().getFullYear()} DevLog. Built for developers.
        </div>
      </div>
    </footer>
  );
}

export default Footer;
