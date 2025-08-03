import React from "react";
import FlightMap from "./FlightMap";

const PlaneIcon = () => (
  <svg className="inline w-7 h-7 text-indigo-600 mr-2" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 21L21.75 12L2.25 3v7.5L15.75 12L2.25 13.5V21z" />
  </svg>
);
const ClockIcon = () => (
  <svg className="inline w-7 h-7 text-indigo-600 mr-2" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 2" stroke="currentColor" strokeWidth="1.5" />
  </svg>
);
// const LocationIcon = () => (
//   <svg className="inline w-7 h-7 text-pink-500 mr-2" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
//     <path strokeLinecap="round" strokeLinejoin="round" d="M12 21c-4.418 0-8-4.03-8-9a8 8 0 1116 0c0 4.97-3.582 9-8 9z" />
//     <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.5" />
//   </svg>
// );

export default function SeatResult({ result, onBack }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-indigo-100 to-purple-100 px-2"
    style={{
        backgroundImage: "url('/map-bg.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="flex flex-col md:flex-row gap-8 w-full max-w-5xl">
        {/* Left: Details */}
        <div className="bg-white rounded-2xl shadow-2xl p-8 h-150 w-full md:w-1/2 border border-indigo-100 text-center mb-8 flex flex-col justify-center">
          <h2 className="text-3xl font-extrabold mb-4 text-indigo-700 tracking-tight">Seat Recommendation</h2>
          <div className="flex flex-col items-center gap-4 mb-6">
            <div className="flex items-center gap-2">
              {/* <LocationIcon /> */}
              <span className="font-semibold text-gray-700 text-lg">{result.sourceAirport?.iata}</span>
              <span className="mx-2 text-indigo-400 text-xl">→</span>
              {/* <LocationIcon /> */}
              <span className="font-semibold text-gray-700 text-lg">{result.destAirport?.iata}</span>
            </div>
            <div className="flex items-center gap-2">
              <ClockIcon />
              <span className="font-semibold text-gray-700 text-lg">
                {new Date(result.departureTime || "").toLocaleString()}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <PlaneIcon />
              <span className="font-semibold text-gray-700 text-lg">
                Duration: <span className="text-indigo-600">{result.duration || "?"} min</span>
              </span>
            </div>
          </div>
          <div className="bg-indigo-50 rounded-xl p-6 mb-6 shadow">
            <h3 className="text-xl font-bold text-indigo-700 mb-2">Recommended Side</h3>
            <div className="text-4xl font-extrabold text-indigo-600 mb-2">{result.side}</div>
            <div className="mb-2 text-gray-700">{result.reason}</div>
          </div>
          <button
            onClick={onBack}
            className="bg-indigo-600 text-white py-2 px-6 rounded-lg font-bold text-lg hover:bg-indigo-700 transition shadow"
          >
            Back
          </button>
        </div>
        {/* Right: Map */}
        <div className="bg-white rounded-2xl shadow-xl p-8 h-150 w-full md:w-1/2 border border-indigo-100 text-center flex flex-col justify-center">
          <h3 className="text-3xl font-extrabold mb-4 text-indigo-700 tracking-tight">Flight Path & Sun Visualization</h3>
          <FlightMap
            sourceAirport={result.sourceAirport}
            destAirport={result.destAirport}
            departureTime={result.departureTime}
            duration={result.duration}
          />
        </div>
      </div>
    </div>
  );
}