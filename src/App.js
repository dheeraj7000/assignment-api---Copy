import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [cityInput, setCityInput] = useState('');
  const [weatherData, setWeatherData] = useState([]);
  const [error, setError] = useState('');

  const handleInputChange = (event) => {
    setCityInput(event.target.value);
  };

  const getWeatherData = async () => {
    try {
      const cities = cityInput.split(',').map((city) => city.trim());
      const response = await axios.post('/getWeather', { cities });
      const data = response.data.weather;
      setWeatherData(data);
      setError('');
    } catch (error) {
      console.error('Error:', error.message);
      setWeatherData([]);
      setError('An error occurred while fetching weather data.');
    }
  };
  document.title = "Weather App"
  return (
    <div className="App">
      <h2>Weather App</h2>
      <div>
        <label htmlFor="cityInput">Enter City Names (comma-separated):</label>
        <input
          type="text"
          id="cityInput"
          value={cityInput}
          onChange={handleInputChange}
        />
      </div>
      <button onClick={getWeatherData}>Get Weather</button>
      {error && <p className="error">{error}</p>}
      {Object.keys(weatherData).length > 0 && (
        <div>
          <h3>Weather Results:</h3>
          <ul>
            {Object.entries(weatherData).map(([city, weather]) => (
              <li key={city}>
                {city}: {weather}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default App;
