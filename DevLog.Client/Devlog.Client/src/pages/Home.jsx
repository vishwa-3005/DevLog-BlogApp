import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import React from "react";

function Home() {
  return (
    <div className="relative bg-zinc-950 text-zinc-200 min-h-screen overflow-hidden">
      {/* Subtle Grid Background */}
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.04)_1px,transparent_1px)] bg-size-[40px_40px]" />

      {/* Hero Section */}
      <section className="relative py-32 px-4 text-center">
        {/* Gradient Glow */}
        <div className="absolute inset-0 bg-linear-to-r from-emerald-500/10 via-transparent to-indigo-500/10 blur-3xl -z-10" />

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto"
        >
          <h1 className="text-5xl md:text-6xl font-bold leading-tight tracking-tight">
            Write. Build.
            <span className="bg-linear-to-r from-emerald-400 to-indigo-500 bg-clip-text text-transparent">
              {" "}
              Share.
            </span>
          </h1>

          <p className="mt-6 text-lg text-zinc-400 max-w-2xl mx-auto leading-relaxed">
            DevLog is a focused platform for developers to document their
            journey, publish technical insights, and build a professional
            presence.
          </p>

          <div className="mt-12 flex flex-col sm:flex-row justify-center gap-6">
            <Link
              to="/posts"
              className="bg-white text-black px-8 py-3 rounded-xl font-semibold hover:bg-zinc-200 transition duration-200 shadow-lg shadow-white/5"
            >
              Explore Posts
            </Link>

            <Link
              to="/signup"
              className="border border-zinc-700 px-8 py-3 rounded-xl hover:border-zinc-500 hover:bg-zinc-900 transition duration-200"
            >
              Get Started
            </Link>
          </div>
        </motion.div>
      </section>

      {/* Feature Section */}
      <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-12">
          <div className="group bg-zinc-900/70 backdrop-blur border border-zinc-800 rounded-2xl p-8 transition duration-300 hover:border-emerald-500/40 hover:-translate-y-1">
            <h3 className="text-xl font-semibold mb-4 group-hover:text-emerald-400 transition">
              Structured Writing
            </h3>
            <p className="text-zinc-400 leading-relaxed">
              Write clean, focused technical articles with support for
              structured formatting and version-style editing.
            </p>
          </div>

          <div className="group bg-zinc-900/70 backdrop-blur border border-zinc-800 rounded-2xl p-8 transition duration-300 hover:border-indigo-500/40 hover:-translate-y-1">
            <h3 className="text-xl font-semibold mb-4 group-hover:text-indigo-400 transition">
              Developer Portfolio
            </h3>
            <p className="text-zinc-400 leading-relaxed">
              Showcase your growth, document projects, and create a lasting
              professional footprint.
            </p>
          </div>

          <div className="group bg-zinc-900/70 backdrop-blur border border-zinc-800 rounded-2xl p-8 transition duration-300 hover:border-purple-500/40 hover:-translate-y-1">
            <h3 className="text-xl font-semibold mb-4 group-hover:text-purple-400 transition">
              Community Driven
            </h3>
            <p className="text-zinc-400 leading-relaxed">
              Engage with developers, exchange ideas, and build meaningful
              technical discussions.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-28 text-center border-t border-zinc-800">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl font-bold tracking-tight">
            Start Documenting Your Developer Journey
          </h2>

          <p className="mt-5 text-zinc-400 max-w-xl mx-auto">
            Every strong developer builds publicly. Your knowledge deserves to
            be visible.
          </p>

          <Link
            to="/signup"
            className="inline-block mt-10 bg-linear-to-r from-emerald-400 to-indigo-500 px-10 py-4 rounded-xl font-semibold text-black hover:opacity-90 transition duration-200 shadow-lg shadow-emerald-500/10"
          >
            Join DevLog
          </Link>
        </motion.div>
      </section>
    </div>
  );
}

export default Home;
