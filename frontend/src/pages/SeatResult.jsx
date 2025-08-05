import React from "react";
import FlightMap from "./FlightMap";

const PlaneIcon = () => (
  <svg className="inline w-7 h-7 text-blue-600 mr-2" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 21L21.75 12L2.25 3v7.5L15.75 12L2.25 13.5V21z" />
  </svg>
);
const ClockIcon = () => (
  <svg className="inline w-7 h-7 text-blue-600 mr-2" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 2" stroke="currentColor" strokeWidth="1.5" />
  </svg>
);

export default function SeatResult({ result, onBack }) {
  const getFormattedReason = () => {
    const relevantEvent = result.sunrise || result.sunset;
    if (!relevantEvent || !relevantEvent.time) {
      return result.reason;
    }
    const eventDate = new Date(relevantEvent.time);
    const localTimeString = eventDate.toLocaleTimeString(navigator.language, {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
    const reasonPrefix = result.reason.substring(0, result.reason.lastIndexOf('around') + 'around'.length);
    return `${reasonPrefix} ${localTimeString}.`;
  };

  const formatDepartureTime = (utcString) => {
    if (!utcString) return "";
    return new Date(utcString).toLocaleString(navigator.language, {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
    });
  };

  return (
    <div
      className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-900 via-indigo-700 to-purple-900 px-2"
      style={{
        backgroundImage: "url('/map-bg.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="flex flex-col md:flex-row gap-8 w-full max-w-7xl">
        {/* Left: Details */}
        <div className="bg-white bg-opacity-95 rounded-3xl shadow-2xl p-10 h-150 w-full md:w-1/3 border-2 border-blue-400 text-center mb-8 flex flex-col justify-center"
          style={{ boxShadow: "0 8px 32px 0 rgba(44, 62, 80, 0.2)" }}>
          <h2 className="text-3xl font-extrabold mb-6 text-blue-800 tracking-tight drop-shadow-lg">Seat Recommendation</h2>
          <div className="flex flex-col items-center gap-4 mb-8">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-blue-900 text-lg">{result.sourceAirport?.iata}</span>
              <span className="mx-2 text-blue-400 text-xl">→</span>
              <span className="font-semibold text-blue-900 text-lg">{result.destAirport?.iata}</span>
            </div>
            <div className="flex items-center gap-2">
              <ClockIcon />
              <span className="font-semibold text-blue-900 text-lg">
                {formatDepartureTime(result.departureTime)}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <PlaneIcon />
              <span className="font-semibold text-blue-900 text-lg">
                Duration: <span className="text-blue-600">{result.duration || "?"} min</span>
              </span>
            </div>
          </div>
          <div className="bg-blue-50 rounded-xl p-6 mb-6 shadow">
            <h3 className="text-xl font-bold text-blue-700 mb-2">Recommended Side</h3>
            <div className="text-4xl font-extrabold text-blue-600 mb-2">{result.side}</div>
            <div className="mb-2 text-blue-900">{getFormattedReason()}</div>
          </div>
          <button
            onClick={onBack}
            className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-3 px-8 rounded-xl font-bold text-lg hover:bg-indigo-800 transition shadow-lg"
            style={{ cursor: "pointer" }}
          >
            Check Other Flights
          </button>
        </div>
        {/* Right: Map */}
        <div className="bg-white bg-opacity-95 rounded-3xl shadow-xl p-10 h-150 w-full md:w-2/3 border-2 border-blue-400 text-center flex flex-col justify-center"
          style={{ boxShadow: "0 8px 32px 0 rgba(44, 62, 80, 0.2)" }}>
          <h3 className="text-3xl font-extrabold mb-6 text-blue-800 tracking-tight">Flight Path & Sun Visualization</h3>
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