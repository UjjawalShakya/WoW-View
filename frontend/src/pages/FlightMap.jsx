import React, { useState } from "react";
import { MapContainer, TileLayer, Marker, Polyline } from "react-leaflet";
import "leaflet-rotatedmarker";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

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
        const dec = Math.asin(Math.sin(L) * Math.sin(0)+ Math.cos(L)* Math.sin(L)*0);
        const ra = Math.atan2(Math.sin(L) * Math.cos(0), Math.cos(L));
        return { dec, ra };
    }
    function siderealTime(dDays) { return rad * (280.16 + 360.9856235 * dDays); }
    function normalizeLon(lon){
    return ((((lon + 180) % 360) + 360) % 360) - 180;
    }
    const dDays = toDays(date);
    const { ra, dec } = sunCoords(dDays);
    const gst = siderealTime(dDays);
    const lon = normalizeLon((ra * deg - gst * deg) % 360);
    const lat = dec * deg;
    return { lat, lon};
}

function getBearing(from, to) {
  const lat1 = from.lat * Math.PI / 180;
  const lon1 = from.lon * Math.PI / 180;
  const lat2 = to.lat * Math.PI / 180;
  const lon2 = to.lon * Math.PI / 180;
  const dLon = lon2 - lon1;
  const y = Math.sin(dLon) * Math.cos(lat2);
  const x = Math.cos(lat1) * Math.sin(lat2) -
            Math.sin(lat1) * Math.cos(lat2) * Math.cos(dLon);
  const brng = Math.atan2(y, x) * 180 / Math.PI;
  return (brng + 360) % 360;
}

// Helper: interpolate position along great circle
function interpolateCoords(source, dest, fraction) {
  // Simple linear interpolation for demo; for more accuracy use turf.greatCircle
  const lat = source.lat + (dest.lat - source.lat) * fraction;
  const lon = source.lon + (dest.lon - source.lon) * fraction;
  return { lat, lon };
}

// Custom icons
const SourceIcon = new L.Icon({
  iconUrl: "/pin.png", // path relative to public folder
  iconSize: [32, 32],
  iconAnchor: [16, 16],
});
const DestIcon = new L.Icon({
  iconUrl: "/location.png", // path relative to public folder
  iconSize: [32, 32],
  iconAnchor: [16, 16],
});
const planeIcon = new L.Icon({
  iconUrl: "/airplane.png", // path relative to public folder
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
      <div className="rounded-3xl border-2 border-blue-400 shadow-2xl overflow-hidden"
        style={{ boxShadow: "0 8px 32px 0 rgba(44, 62, 80, 0.2)" }}>
        <MapContainer center={center} zoom={3} style={{ height: "400px", width: "100%" }}>
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution="&copy; OpenStreetMap contributors"
          />
          <Polyline positions={path} color="indigo" />
          <Polyline positions={path2} color="yellow" />
          <Marker
  position={[planePos.lat, planePos.lon]}
  icon={planeIcon}
  rotationAngle={getBearing(planePos, dest)}
  rotationOrigin="center"
/>
          <Marker position={[sunPos.lat, sunPos.lon]} icon={sunIcon} />
          <Marker position={[source.lat, source.lon]} icon={SourceIcon} />
          <Marker position={[dest.lat, dest.lon]} icon={SourceIcon} />
        </MapContainer>
      </div>
      <div className="flex items-center gap-2 mt-4">
        <label className="font-semibold text-blue-900">Flight Time:</label>
        <input
          type="range"
          min={0}
          max={duration}
          value={flightTime}
          onChange={e => setFlightTime(Number(e.target.value))}
          className="flex-1 accent-blue-600"
        />
        <span className="font-mono text-blue-700">{flightTime} min</span>
      </div>
    </div>
  );
}