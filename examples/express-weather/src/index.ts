/**
 * Weather API with x402 Payments
 * 
 * A REST API serving weather data with tiered pricing:
 * - Basic: $0.001 (current weather only)
 * - Detailed: $0.01 (includes forecast and historical)
 * - Premium: $0.05 (includes alerts and radar)
 */

import express from "express";
import cors from "cors";
import { readFileSync } from "node:fs";
import { x402WithFreeRoutes, discoveryMiddleware } from "@nirholas/x402-deploy";

// Route prices, wallet and discovery text live in x402.config.json.
// X402_WALLET overrides the wallet without editing the file.
const config = JSON.parse(readFileSync(new URL("../x402.config.json", import.meta.url), "utf8"));
if (process.env.X402_WALLET) config.payment.wallet = process.env.X402_WALLET;

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Add discovery endpoint (/.well-known/x402)
app.use(discoveryMiddleware({ config }));

// Apply x402 payment gateway
app.use(x402WithFreeRoutes({ config }, ["/health", "/docs", "/.well-known/x402"]));

/**
 * Mock weather data generator
 */
function generateWeatherData(location: string, detailed: boolean = false) {
  const temp = Math.floor(Math.random() * 40) - 10; // -10 to 30°C
  const conditions = ["Sunny", "Cloudy", "Rainy", "Snowy", "Windy"];
  const condition = conditions[Math.floor(Math.random() * conditions.length)];

  const basic = {
    location,
    temperature: temp,
    condition,
    humidity: Math.floor(Math.random() * 100),
    wind_speed: Math.floor(Math.random() * 50),
    timestamp: new Date().toISOString(),
  };

  if (!detailed) return basic;

  return {
    ...basic,
    forecast: Array.from({ length: 7 }, (_, i) => ({
      day: new Date(Date.now() + i * 86400000).toLocaleDateString(),
      high: temp + Math.floor(Math.random() * 10),
      low: temp - Math.floor(Math.random() * 10),
      condition: conditions[Math.floor(Math.random() * conditions.length)],
    })),
    historical: Array.from({ length: 30 }, (_, i) => ({
      date: new Date(Date.now() - i * 86400000).toLocaleDateString(),
      avg_temp: temp + Math.floor(Math.random() * 10) - 5,
    })),
    alerts: [],
  };
}

/**
 * Routes
 */

// Health check (free)
app.get("/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// Current weather (basic tier - $0.001)
app.get("/api/weather/current", (req, res) => {
  const location = req.query.location as string || "New York";
  const weather = generateWeatherData(location, false);
  
  res.json({
    success: true,
    data: weather,
    tier: "basic",
    cost: "$0.001",
  });
});

// 7-day forecast (detailed tier - $0.01)
app.get("/api/weather/forecast", (req, res) => {
  const location = req.query.location as string || "New York";
  const weather = generateWeatherData(location, true);
  
  res.json({
    success: true,
    data: {
      current: {
        location: weather.location,
        temperature: weather.temperature,
        condition: weather.condition,
      },
      forecast: weather.forecast,
    },
    tier: "detailed",
    cost: "$0.01",
  });
});

// Historical data (detailed tier - $0.01)
app.get("/api/weather/historical", (req, res) => {
  const location = req.query.location as string || "New York";
  const days = parseInt(req.query.days as string) || 30;
  const weather = generateWeatherData(location, true);
  
  res.json({
    success: true,
    data: {
      location: weather.location,
      historical: weather.historical.slice(0, days),
    },
    tier: "detailed",
    cost: "$0.01",
  });
});

// Premium features (premium tier - $0.05)
app.get("/api/weather/premium", (req, res) => {
  const location = req.query.location as string || "New York";
  const weather = generateWeatherData(location, true);
  
  res.json({
    success: true,
    data: {
      ...weather,
      radar_url: `https://radar.example.com/${location}`,
      satellite_url: `https://satellite.example.com/${location}`,
      air_quality: Math.floor(Math.random() * 500),
      uv_index: Math.floor(Math.random() * 12),
      pollen_count: Math.floor(Math.random() * 10),
    },
    tier: "premium",
    cost: "$0.05",
  });
});

// Weather alerts (premium tier - $0.05)
app.get("/api/weather/alerts", (req, res) => {
  const location = req.query.location as string || "New York";
  
  const alerts = [];
  if (Math.random() > 0.7) {
    alerts.push({
      type: "warning",
      title: "Severe Weather Alert",
      description: "Heavy rain expected in the next 6 hours",
      severity: "moderate",
      expires: new Date(Date.now() + 21600000).toISOString(),
    });
  }
  
  res.json({
    success: true,
    data: {
      location,
      alerts,
      count: alerts.length,
    },
    tier: "premium",
    cost: "$0.05",
  });
});

// API Documentation (free)
app.get("/docs", (req, res) => {
  res.json({
    name: "Weather API with x402",
    version: "1.0.0",
    pricing: {
      basic: {
        price: "$0.001",
        endpoints: ["/api/weather/current"],
        description: "Current weather conditions",
      },
      detailed: {
        price: "$0.01",
        endpoints: ["/api/weather/forecast", "/api/weather/historical"],
        description: "7-day forecast and historical data",
      },
      premium: {
        price: "$0.05",
        endpoints: ["/api/weather/premium", "/api/weather/alerts"],
        description: "Radar, satellite, air quality, and alerts",
      },
    },
    payment: {
      token: "USDC",
      network: "Base (eip155:8453)",
      wallet: process.env.X402_WALLET,
    },
    usage: {
      example: "GET /api/weather/current?location=London",
      headers: {
        "X-Payment-Hash": "0x... (USDC transfer transaction hash)",
      },
    },
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🌤️  Weather API with x402 payments`);
  console.log(`📍 Server: http://localhost:${PORT}`);
  console.log(`💰 Wallet: ${process.env.X402_WALLET}`);
  console.log(`🔗 Network: Base (eip155:8453)`);
  console.log(`\n📊 Pricing:`);
  console.log(`   Basic:    $0.001 - Current weather`);
  console.log(`   Detailed: $0.01  - Forecast & history`);
  console.log(`   Premium:  $0.05  - Alerts & radar`);
  console.log(`\n📖 Docs: http://localhost:${PORT}/docs`);
});
