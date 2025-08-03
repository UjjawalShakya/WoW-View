import React, { useState } from "react";
import { MapContainer, TileLayer, Marker, Polyline } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Helper: get subsolar point (same as backend)
function getSubsolarPoint(date) {
  const rad = Math.PI / 180, deg = 180 / Math.PI;
  function toDays(d) { return d.getTime() / 86400000 - 10957.5; }
  function solarMeanAnomaly(d) { return rad * (357.5291 + 0.98560028 * d); }
  function eclipticLongitude(M) {
    const C = rad * (1.9148 * Math.sin(M) + 0.02 * Math.sin(2 * M) + 0.0003 * Math.sin(3 * M));
    const P = rad * 102.9372;
    return M + C + P + Math.PI;
  }
  function sunCoords(dDays) {
    const M = solarMeanAnomaly(dDays);
    const L = eclipticLongitude(M);
    const dec = Math.asin(Math.sin(L) * Math.sin(rad * 23.4397));
    const ra = Math.atan2(Math.sin(L) * Math.cos(rad * 23.4397), Math.cos(L));
    return { dec, ra };
  }
  function siderealTime(dDays, lon) { return rad * (280.16 + 360.9856235 * dDays) + lon; }
  const dDays = toDays(date);
  const { ra, dec } = sunCoords(dDays);
  const lon = (ra - siderealTime(dDays, 0)) * deg;
  const lat = dec * deg;
  return { lat, lon: (lon + 540) % 360 - 180 };
}

// Helper: interpolate position along great circle
function interpolateCoords(source, dest, fraction) {
  // Simple linear interpolation for demo; for more accuracy use turf.greatCircle
  const lat = source.lat + (dest.lat - source.lat) * fraction;
  const lon = source.lon + (dest.lon - source.lon) * fraction;
  return { lat, lon };
}

// Custom icons
const planeIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/34/34627.png",
  iconSize: [32, 32],
  iconAnchor: [16, 16],
});
const sunIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/869/869869.png",
  iconSize: [32, 32],
  iconAnchor: [16, 16],
});

export default function FlightMap({ sourceAirport, destAirport, departureTime, duration }) {
  const [flightTime, setFlightTime] = useState(0);

  // Coordinates
  const source = sourceAirport?.location;
  const dest = destAirport?.location;

  const validCoords = source && dest && typeof source.lat === "number" && typeof source.lon === "number" && typeof dest.lat === "number" && typeof dest.lon === "number" &&
    !isNaN(source.lat) && !isNaN(source.lon) && !isNaN(dest.lat) && !isNaN(dest.lon);

  if (!validCoords) {
    return (
      <div className="text-red-500 font-bold my-8">
        Map data unavailable. Please check your backend response for valid coordinates.
      </div>
    );
  }
  const path = [
    [source.lat, source.lon],
    [dest.lat, dest.lon],
  ];

  // Plane position
  const fraction = duration ? flightTime / duration : 0;
  const planePos = interpolateCoords(source, dest, fraction);

  // Sun position
  const currentTime = new Date(new Date(departureTime).getTime() + flightTime * 60000);
  const sunPos = getSubsolarPoint(currentTime);

  const path2 = [
    [planePos.lat, planePos.lon],
    [sunPos.lat, sunPos.lon],
  ];

  // Center map between source and dest
  const center = [
    (source.lat + dest.lat) / 2,
    (source.lon + dest.lon) / 2,
  ];

  return (
    <div className="mb-8">
      <MapContainer center={center} zoom={3} style={{ height: "400px", width: "100%" }}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; OpenStreetMap contributors"
        />
        <Polyline positions={path} color="indigo" />
        <Polyline positions={path2} color="yellow" />
        <Marker position={[planePos.lat, planePos.lon]} icon={planeIcon}>
        </Marker>
        <Marker position={[sunPos.lat, sunPos.lon]} icon={sunIcon}>
        </Marker>
        <Marker position={[source.lat, source.lon]}>
        </Marker>
        <Marker position={[dest.lat, dest.lon]}>
        </Marker>
      </MapContainer>
      <div className="flex items-center gap-4 mt-4">
        <label className="font-semibold text-gray-700">Flight Time:</label>
        <input
          type="range"
          min={0}
          max={duration}
          value={flightTime}
          onChange={e => setFlightTime(Number(e.target.value))}
          className="flex-1"
        />
        <span className="font-mono">{flightTime} min</span>
      </div>
    </div>
  );
}