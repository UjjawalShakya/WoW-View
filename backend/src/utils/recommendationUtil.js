const turf = require("@turf/turf");
const SunCalc = require("suncalc");

function getSubsolarPoint(date) {
    const rad = Math.PI / 180, deg = 180 / Math.PI;
    const obliquity = 23.4397 * rad;
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
        const dec = Math.asin(Math.sin(L) * Math.sin(obliquity));
        const ra = Math.atan2(Math.sin(L) * Math.cos(obliquity), Math.cos(L));
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

function recommendSideByLonAngle(flightCoords, destCoords, time) {
    const sub = getSubsolarPoint(time);
    const bearingToDest = turf.bearing(turf.point(flightCoords), turf.point(destCoords));
    const bearingToSun = turf.bearing(turf.point(flightCoords), turf.point([sub.lon, sub.lat]));
    const angleDiff = ((bearingToSun - bearingToDest + 540) % 360) - 180;
    return angleDiff > 0 ? "RIGHT" : "LEFT";
}

exports.generateAdvancedRecommendation = function(flightDetails, sourceAirport, destAirport) {
    const departureTime = new Date(flightDetails.departureTime);
    const duration = flightDetails.duration;
    const intervalMinutes = 1;
    const sourceCoords = [sourceAirport.location.lon, sourceAirport.location.lat];
    const destCoords = [destAirport.location.lon, destAirport.location.lat];
    const path = turf.lineString([sourceCoords, destCoords]);
    const totalLength = turf.length(path);
    let leftCount = 0, rightCount = 0, sunriseEvent = null, sunsetEvent = null;

    for (let i = 0; i <= duration; i += intervalMinutes) {
        const currentTime = new Date(departureTime.getTime() + i * 60 * 1000);
        const distAlong = (i / (duration || 1)) * totalLength;
        const coord = turf.along(path, distAlong).geometry.coordinates;
        const side = recommendSideByLonAngle(coord, destCoords, currentTime);
        if (side === "LEFT") leftCount++; else rightCount++;
        const [lon, lat] = coord;
        const dateAtLocation = new Date(currentTime);
        dateAtLocation.setHours(12,0,0,0);
        const times = SunCalc.getTimes(dateAtLocation, lat, lon, 0, false);
        console.log(times);
        const sunriseStart = new Date(times.sunrise.getTime() - 5 * 60 * 1000);
        const sunriseEnd = new Date(times.sunrise.getTime() + 5 * 60 * 1000);
        const sunsetStart = new Date(times.sunset.getTime() - 5 * 60 * 1000);
        const sunsetEnd = new Date(times.sunset.getTime() + 5 * 60 * 1000);

        if (currentTime >= sunriseStart && currentTime <= sunriseEnd) {
            sunriseEvent = { time: currentTime, location: { lat, lon } };
        }
        if (currentTime >= sunsetStart && currentTime <= sunsetEnd) {
            sunsetEvent = { time: currentTime, location: { lat, lon } };
        }
    }

    let finalSide, reason;
    if (flightDetails.sunPreference.wantsSunrise && sunriseEvent && flightDetails.sunPreference.priority === 'SUNRISE') {
        finalSide = recommendSideByLonAngle([sunriseEvent.location.lon, sunriseEvent.location.lat], destCoords, sunriseEvent.time);
        reason = `For the best sunrise view, choose the ${finalSide.toLowerCase()} side. The sun will rise around ${sunriseEvent.time.toLocaleTimeString()}.`;
    } else if (flightDetails.sunPreference.wantsSunset && sunsetEvent && flightDetails.sunPreference.priority === 'SUNSET') {
        finalSide = recommendSideByLonAngle([sunsetEvent.location.lon, sunsetEvent.location.lat], destCoords, sunsetEvent.time);
        reason = `For the best sunset view, choose the ${finalSide.toLowerCase()} side. The sun will set around ${sunsetEvent.time.toLocaleTimeString()}.`;
    } else if (flightDetails.sunPreference.wantsSunrise && sunriseEvent) {
        finalSide = recommendSideByLonAngle([sunriseEvent.location.lon, sunriseEvent.location.lat], destCoords, sunriseEvent.time);
        reason = `A sunrise will occur on the ${finalSide.toLowerCase()} side around ${sunriseEvent.time.toLocaleTimeString()}.`;
    } else if (flightDetails.sunPreference.wantsSunset && sunsetEvent) {
        finalSide = recommendSideByLonAngle([sunsetEvent.location.lon, sunsetEvent.location.lat], destCoords, sunsetEvent.time);
        reason = `A sunset will occur on the ${finalSide.toLowerCase()} side around ${sunsetEvent.time.toLocaleTimeString()}.`;
    } else {
        finalSide = leftCount > rightCount ? "LEFT" : "RIGHT";
        reason = `No specific sunrise or sunset event detected during your flight. For the majority of the journey, the sun will be on the ${finalSide.toLowerCase()} side.`;
    }

    return { side: finalSide, reason, sunrise: sunriseEvent, sunset: sunsetEvent };
}

// module.exports = { generateAdvancedRecommendation };
