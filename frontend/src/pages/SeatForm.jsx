import React, { useState } from "react";

const SunriseIcon = () => <svg className="w-6 h-6 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>;
const SunsetIcon = () => <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>;


export default function SeatForm({ onSubmit, loading }) {
  const [source, setSource] = useState("");
  const [destination, setDestination] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [preference, setPreference] = useState("SUNSET");
  const [duration, setDuration] = useState("");


  const handleSubmit = (e) => {
    e.preventDefault();
    if (!date || !time) {
      alert("Please select both a date and a time.");
      return;
    }
    const localDateTimeString = `${date}T${time}`;
    const localDate = new Date(localDateTimeString);
    const departureTime = localDate.toISOString();
    onSubmit({ source, destination, departureTime, preference, duration });
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-indigo-100 to-purple-100"
    style={{
        backgroundImage: "url('/map-bg.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-lg border border-indigo-100">
        <h1 className="text-3xl font-bold mb-6 text-center text-indigo-700">WOW VIEW</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block mb-2 font-semibold text-gray-700">Source (Airport Code)</label>
            <input type="text" value={source} onChange={e => setSource(e.target.value)} required className="w-full border border-indigo-200 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-indigo-400" placeholder="e.g. SFO" />
          </div>
          <div>
            <label className="block mb-2 font-semibold text-gray-700">Destination (Airport Code)</label>
            <input type="text" value={destination} onChange={e => setDestination(e.target.value)} required className="w-full border border-indigo-200 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-indigo-400" placeholder="e.g. JFK" />
          </div>
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block mb-2 font-semibold text-gray-700">Date</label>
              <input type="date" value={date} onChange={e => setDate(e.target.value)} required className="w-full border border-indigo-200 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-indigo-400" />
            </div>
            <div className="flex-1">
              <label className="block mb-2 font-semibold text-gray-700">Time</label>
              <input type="time" value={time} onChange={e => setTime(e.target.value)} required className="w-full border border-indigo-200 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-indigo-400" />
            </div>
          </div>
          <div>
            <label className="block mb-2 font-semibold text-gray-700">Duration (minutes)</label>
            <input
              type="number"
              value={duration}
              onChange={e => setDuration(e.target.value)}
              required
              min={1}
              className="w-full border border-indigo-200 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-indigo-400"
              placeholder="e.g. 180"
            />
          </div>
          <div>
            <label className="block mb-2 font-semibold text-gray-700">Preference</label>
            <div className="flex gap-3">
              <label className="flex items-center cursor-pointer">
                <input type="radio" value="SUNRISE" checked={preference === 'SUNRISE'} onChange={() => setPreference('SUNRISE')} className="accent-indigo-600" />
                <span className="ml-2 text-indigo-600 font-medium">Sunrise</span>
              </label>
              <SunriseIcon/>
              <label className="flex items-center cursor-pointer">
                <input type="radio" value="SUNSET" checked={preference === 'SUNSET'} onChange={() => setPreference('SUNSET')} className="accent-indigo-600" />
                <span className="ml-2 text-indigo-600 font-medium">Sunset</span>
              </label>
              <SunsetIcon/>
            </div>
          </div>
          <button type="submit" disabled={loading} className="w-full bg-indigo-600 text-white py-3 rounded-lg font-bold text-lg hover:bg-indigo-700 transition"
          style={{  cursor: "pointer" }}>
            {loading ? "Loading..." : "Get Recommendation"}
          </button>
        </form>
      </div>
    </div>
  );
}