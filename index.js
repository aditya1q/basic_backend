import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';

const app = express();
app.use(cors());
dotenv.config();

const port = process.env.PORT || 8000;

// Helper function to check if a date is a weekend
const isWeekend = (date) => {
  const day = date.getDay();
  return day === 0 || day === 6;
};

// Helper function to get market hours for a day
const getMarketHours = (date) => {
  const marketHours = [];
  const marketOpen = new Date(date);
  marketOpen.setHours(9, 15, 0, 0);

  const marketClose = new Date(date);
  marketClose.setHours(15, 30, 0, 0);

  while (marketOpen <= marketClose) {
    marketHours.push(new Date(marketOpen));
    marketOpen.setMinutes(marketOpen.getMinutes() + 1);
  }

  return marketHours;
};

// Generate mock financial data
const generateMockData = (symbol, interval, startDate, endDate) => {
  const data = [];
  let currentDate = new Date(startDate);
  const end = new Date(endDate);
  let basePrice = 100; // Starting base price for the first data point

  while (currentDate <= end) {
    // Skip weekends
    if (isWeekend(currentDate)) {
      currentDate.setDate(currentDate.getDate() + 1);
      continue;
    }

    // Get market hours for the day
    const marketHours = getMarketHours(currentDate);

    for (const time of marketHours) {
      const open = basePrice + Math.random() * 10 - 5;
      const close = open + Math.random() * 10 - 5;
      const high = Math.max(open, close, open + Math.random() * 5);
      const low = Math.min(open, close, open - Math.random() * 5);

      data.push({
        time: Math.floor(time.getTime() / 1000), // Unix timestamp in seconds
        open: parseFloat(open.toFixed(2)),
        high: parseFloat(high.toFixed(2)),
        low: parseFloat(low.toFixed(2)),
        close: parseFloat(close.toFixed(2)),
        volume: Math.floor(Math.random() * 1000),
      });

      basePrice = close; // Set the base price for the next iteration
    }

    // Move to the next day
    currentDate.setDate(currentDate.getDate() + 1);
  }
  return data;
};

// Example endpoint for TradingView advanced chart data
app.get('/api/chart-data', (req, res) => {
  const symbol = req.query.symbol || 'AAPL';
  const interval = req.query.interval || '1MIN';
  const endDate = req.query.endDate || new Date().toISOString().split('T')[0];
  const startDate = req.query.startDate || new Date(new Date().setFullYear(new Date().getFullYear() - 5)).toISOString().split('T')[0];

  // Validate date format YYYY-MM-DD
  const isValidDate = (dateStr) => /^\d{4}-\d{2}-\d{2}$/.test(dateStr);

  if (!isValidDate(startDate) || !isValidDate(endDate)) {
    return res.status(400).json({ error: 'Invalid date format. Use YYYY-MM-DD.' });
  }

  const chartData = generateMockData(symbol, interval, startDate, endDate);

  res.json(chartData);
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
