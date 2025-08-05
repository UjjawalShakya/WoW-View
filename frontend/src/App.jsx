import React, { useState } from "react";
import SeatForm from "./pages/SeatForm";
import SeatResult from "./pages/SeatResult";
import Navbar from "./pages/Navbar";

export default function App() {
  const [page, setPage] = useState("home");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFormSubmit = async (form) => {
    setLoading(true);
    const params = new URLSearchParams({
      source: form.source,
      destination: form.destination,
      departureTime: form.departureTime,
      duration: form.duration,
      wantsSunrise: form.preference === "SUNRISE",
      wantsSunset: form.preference === "SUNSET",
      priority: form.preference,
    });
    const res = await fetch(`https://wow-view-backend.onrender.com/api/recommend?${params.toString()}`);
    const data = await res.json();
    setResult(data);
    setPage("result");
    setLoading(false);
  };
  const goHome = () => setPage("home");
  return (
    <>
      <Navbar onHome={goHome} />
      {page === "home" ? (
        <SeatForm onSubmit={handleFormSubmit} loading={loading} />
      ) : (
        <SeatResult result={result} onBack={() => setPage("home")} />
      )}
    </>
  );
}