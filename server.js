const express = require('express');
const axios = require('axios');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(cors());

// Endpoint to get weather information
app.post('/getWeather', async (req, res) => {
  try {
    const { cities } = req.body;

    // Prepare the API requests for each city
    const requests = cities.map(city => {
      const apiKey = process.env.WEATHER_API_KEY; // Replace with your own weather API key
      const url = `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${city}`;
      return axios.get(url);
    });

    // Execute all API requests concurrently
    const responses = await Promise.all(requests);

    // Extract the weather information from the responses
    const weather = {};
    responses.forEach((response, index) => {
      const city = cities[index];
      const { temp_c } = response.data.current;
      weather[city] = `${temp_c}C`;
    });

    res.json({ weather });
  } catch (error) {
    console.error('Error:', error.message);
    res.status(500).json({ error: 'An error occurred' });
  }
});

// Serve the React app
app.use(express.static(path.join(__dirname, 'build')));
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

// Start the server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
