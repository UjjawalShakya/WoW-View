// const { generateAdvancedRecommendation } = require('../utils/recommendationUtil');
const axios = require('axios');

// Function to fetch airport data from the external API
async function getAirportData(iataCode) {
    const url = `${process.env.API_BASE_URL}${iataCode}`;
    console.log(`Fetching data for IATA code: ${iataCode} from URL: ${url}`);
    try {
        const response = await axios.get(url, {
            headers: {
              //  'X-Api-Key': process.env.API_KEY ,
               'x-rapidapi-key': process.env.API_KEY,
		'x-rapidapi-host': 'aerodatabox.p.rapidapi.com'
              }
        });
        return {
            iata: response.data.iata,
            name: response.data.fullName,
            location: {
                lat: response.data.location.lat,
                lon: response.data.location.lon
            }
        };
    } catch (error) {
        console.error(`Failed to fetch data for ${iataCode}:`, error.response ? error.response.data : error.message);
        return null;
    }
}

// Controller function to handle the /recommend request
async function getSeatRecommendation(req, res) {
    try {
        const { source, destination, departureTime, duration, wantsSunrise, wantsSunset, priority } = req.query;

        if (!source || !destination || !departureTime || !duration) {
            return res.status(400).json({ error: 'Missing required query parameters.' });
        }

        const [sourceAirport, destAirport] = await Promise.all([
            getAirportData(source.toUpperCase()),
            getAirportData(destination.toUpperCase())
        ]);

        if (!sourceAirport || !destAirport) {
            return res.status(404).json({ error: 'One or both airport codes could not be found.' });
        }

        const flightDetails = {
            source: source.toUpperCase(),
            destination: destination.toUpperCase(),
            departureTime: new Date(departureTime).toISOString(),
            duration: parseInt(duration, 10),
            sunPreference: {
                wantsSunrise: wantsSunrise === 'true',
                wantsSunset: wantsSunset === 'true',
                priority: priority || null,
            },
        };

        // const recommendation = generateAdvancedRecommendation(
        //     flightDetails,
        //     sourceAirport,
        //     destAirport
        // );
        
        res.status(200).json({
            // ...recommendation,
            sourceAirport,
            destAirport,
        });

    } catch (error) {
        console.error("Error in getSeatRecommendation:", error);
        res.status(500).json({ error: "An internal server error occurred." });
    }
}

module.exports = {
    getSeatRecommendation
};