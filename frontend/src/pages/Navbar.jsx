import React from "react";

export default function Navbar({ onHome }) {
  return (
    <nav className="w-full bg-gradient-to-r from-indigo-500 via-blue-300 to-indigo-500 shadow-xl">
      <div className="max-w-7xl mx-auto px-1 py-2 flex items-center justify-between">
        <button
          onClick={onHome}
          className="flex items-center gap-3 text-white text-3xl font-extrabold tracking-wide hover:text-yellow-300 transition duration-200"
          style={{ background: "none", border: "none", cursor: "pointer" }}
        >
          <span className="inline-block">
            ✈️
          </span>
          WOWView
        </button>
        <span className="text-blue-100 font-medium text-lg tracking-wide">
          Find your perfect seat for sunrise or sunset!
        </span>
      </div>
    </nav>
  );
}