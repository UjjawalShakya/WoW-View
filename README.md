# ✈️ Wow View - Flight Seat Recommender

A full-stack application that analyzes your flight path to recommend the best seat for sunrise or sunset views, complete with an interactive map visualization.

---

## ✨ Features

- **Smart Recommendation:** Calculates the optimal side (Left/Right) for the best view.
- **Sunrise & Sunset Detection:** Pinpoints if a sunrise/sunset will occur during your flight.
- **Interactive Map:** Visualizes the great-circle flight path with real-time plane and sun positions.
- **Dynamic Airport Data:** Fetches airport coordinates and details from an external API.

---

## 🛠️ Tech Stack

| Area       | Technology                                           |
| :--------- | :--------------------------------------------------- |
| **Frontend** | React, Vite, React-Leaflet, @turf/turf, Tailwind CSS |
| **Backend** | Node.js, Express.js, Axios, @turf/turf, SunCalc3     |

---

## 🚀 Quick Start

**Prerequisites:** Node.js (v18+), npm, and an Airport Data API Key.

### 1. Backend Server

```bash
# Navigate to the backend directory
cd backend

# Create a .env file with your API_BASE_URL and API_KEY
# Example:
# API_BASE_URL=[https://your-api-base-url.com/](https://your-api-base-url.com/)
# API_KEY=your_api_key_here

# Install dependencies and start the server
npm install
node server.js
# Server runs on http://localhost:3000
```

### 2. Frontend Application (in a new terminal)

```bash
# Navigate to the frontend directory
cd frontend

# Install dependencies and start the dev server
npm install
npm run dev
# App runs on http://localhost:5173
```

> **Note:** Both servers must be running. Open `http://localhost:5173` in your browser to use the app.
