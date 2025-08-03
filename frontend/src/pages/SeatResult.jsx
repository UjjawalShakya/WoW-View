import React from "react";

const PlaneIcon = () => (
  <svg className="inline w-6 h-6 text-indigo-500 mr-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path d="M2.5 19.5L21.5 12L2.5 4.5L2.5 10L17.5 12L2.5 14L2.5 19.5Z" />
  </svg>
);
const ClockIcon = () => (
  <svg className="inline w-6 h-6 text-indigo-500 mr-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <circle cx="12" cy="12" r="10" />
    <path d="M12 6v6l4 2" />
  </svg>
);

export default function SeatResult({ result, onBack }) {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-indigo-100 to-purple-100">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-lg border border-indigo-100 text-center">
        <div className="flex flex-col items-center gap-2 mb-6">
          <div>
            <PlaneIcon />
            <span className="font-semibold text-gray-700">{result.sourceAirport?.iata} → {result.destAirport?.iata}</span>
          </div>
          <div>
            <ClockIcon />
            <span className="font-semibold text-gray-700">
              {new Date(result.departureTime || "").toLocaleString()};
            </span>
          </div>
          <div>
            <span className="font-semibold text-gray-700">
              Duration: {result.duration || "?"} min
            </span>
          </div>
        </div>
        <h2 className="text-2xl font-bold mb-4 text-indigo-700">Recommended Side</h2>
        <div className="text-4xl font-extrabold text-indigo-600 mb-2">{result.side}</div>
        <div className="mb-6 text-gray-700">{result.reason}</div>
        <button onClick={onBack} className="bg-gray-200 py-2 px-4 rounded hover:bg-gray-300 font-bold">Back</button>
      </div>
    </div>
  );
}