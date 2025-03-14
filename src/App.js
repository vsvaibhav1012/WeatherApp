import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaSearch, FaWind, FaThermometerHalf, FaTint, FaCompass, FaCloudSun } from 'react-icons/fa';

function App() {
  const [city, setCity] = useState('');
  const [weatherData, setWeatherData] = useState(null);
  const [forecastData, setForecastData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [lastSearched, setLastSearched] = useState('');

  // API key should be stored in .env file
  const API_KEY = process.env.REACT_APP_WEATHER_API_KEY;
  const BASE_URL = 'https://api.openweathermap.org/data/2.5';

  // Load last searched city from localStorage on component mount
  useEffect(() => {
    const savedCity = localStorage.getItem('lastSearchedCity');
    if (savedCity) {
      handleSearch(savedCity);
      setLastSearched(savedCity);
    }
  }, []);

  // Format date
  const formatDate = (timestamp) => {
    const date = new Date(timestamp * 1000);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    });
  };

  // Format time
  const formatTime = (timestamp) => {
    const date = new Date(timestamp * 1000);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Get weather icon URL
  const getWeatherIconUrl = (iconCode) => {
    return `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
  };

  // Get daily high and low temperatures from forecast data
  const getDailyHighLow = (forecastList) => {
    if (!forecastList || forecastList.length === 0) return { high: null, low: null };
    
    // Get today's date as YYYY-MM-DD to filter forecast entries for today
    const today = new Date();
    const todayStr = today.toISOString().split('T')[0];
    
    // Filter forecast entries for today
    const todayForecasts = forecastList.filter(item => {
      const itemDate = new Date(item.dt * 1000);
      return itemDate.toISOString().split('T')[0] === todayStr;
    });
    
    if (todayForecasts.length === 0) return { high: null, low: null };
    
    // Find min and max temperatures
    let high = -Infinity;
    let low = Infinity;
    
    todayForecasts.forEach(item => {
      if (item.main.temp > high) high = item.main.temp;
      if (item.main.temp < low) low = item.main.temp;
    });
    
    return {
      high: high !== -Infinity ? high : null,
      low: low !== Infinity ? low : null
    };
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    if (city.trim()) {
      handleSearch(city.trim());
    }
  };

  // Fetch weather data
  const handleSearch = async (searchCity) => {
    setLoading(true);
    setError(null);
    
    try {
      // Fetch current weather
      const weatherResponse = await axios.get(`${BASE_URL}/weather`, {
        params: {
          q: searchCity,
          appid: API_KEY,
          units: 'metric'
        }
      });
      
      // Fetch forecast for better high/low temps
      const forecastResponse = await axios.get(`${BASE_URL}/forecast`, {
        params: {
          q: searchCity,
          appid: API_KEY,
          units: 'metric'
        }
      });
      
      setWeatherData(weatherResponse.data);
      setForecastData(forecastResponse.data);
      setLastSearched(searchCity);
      setCity('');
      
      // Save to localStorage
      localStorage.setItem('lastSearchedCity', searchCity);
    } catch (err) {
      console.error('Error fetching weather data:', err);
      
      if (err.response && err.response.status === 404) {
        setError('City not found. Please try another location.');
      } else {
        setError('Failed to fetch weather data. Please try again later.');
      }
      
      setWeatherData(null);
      setForecastData(null);
    } finally {
      setLoading(false);
    }
  };

  // Get high/low temperatures
  const tempRange = forecastData ? getDailyHighLow(forecastData.list) : { high: null, low: null };

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* App Header */}
        <div className="flex items-center justify-center mb-8">
          <FaCloudSun className="text-4xl text-blue-500 mr-2" />
          <h1 className="text-3xl font-bold text-gray-800">Weather Dashboard</h1>
        </div>
        
        {/* Search Bar */}
        <form onSubmit={handleSubmit} className="flex items-center w-full max-w-md mx-auto mb-6">
          <div className="relative w-full">
            <input
              type="text"
              placeholder="Search for a city..."
              className="w-full py-3 pl-4 pr-12 text-sm text-gray-700 bg-white border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={city}
              onChange={(e) => setCity(e.target.value)}
            />
            <button
              type="submit"
              className="absolute inset-y-0 right-0 flex items-center justify-center w-12 text-white bg-blue-500 rounded-r-lg hover:bg-blue-600"
            >
              <FaSearch />
            </button>
          </div>
        </form>
        
        {/* Status Messages */}
        {loading && (
          <div className="text-center py-4">
            <p>Loading weather data...</p>
          </div>
        )}
        
        {error && (
          <div className="text-center py-4 text-red-500">
            <p>{error}</p>
          </div>
        )}
        
        {/* Weather Card */}
        {weatherData && (
          <div className="w-full max-w-lg mx-auto overflow-hidden bg-white rounded-lg shadow-lg">
            {/* Header */}
            <div className="px-6 py-4 bg-blue-500 text-white">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-2xl font-bold">{weatherData.name}</h2>
                  <p className="text-sm opacity-90">{formatDate(weatherData.dt)}</p>
                </div>
                <div className="text-right">
                  <p className="text-3xl font-bold">{Math.round(weatherData.main.temp)}°C</p>
                  <p className="text-sm">
                    Feels like: {Math.round(weatherData.main.feels_like)}°C
                  </p>
                </div>
              </div>
            </div>

            {/* Current Weather */}
            <div className="px-6 py-4">
              <div className="flex items-center mb-4">
                <img
                  src={getWeatherIconUrl(weatherData.weather[0].icon)}
                  alt={weatherData.weather[0].description}
                  className="w-16 h-16"
                />
                <div className="ml-4">
                  <p className="text-lg font-semibold capitalize">
                    {weatherData.weather[0].description}
                  </p>
                  <p className="text-sm text-gray-600">
                    Updated at {formatTime(weatherData.dt)}
                  </p>
                </div>
              </div>

              {/* Details */}
              <div className="grid grid-cols-2 gap-4 mt-4">
                <div className="flex items-center">
                  <FaThermometerHalf className="text-red-500 mr-2" />
                  <div>
                    <p className="text-sm text-gray-600">High / Low</p>
                    <p className="font-medium">
                      {tempRange.high !== null ? `${Math.round(tempRange.high)}°` : Math.round(weatherData.main.temp_max) + '°'} / 
                      {tempRange.low !== null ? `${Math.round(tempRange.low)}°` : Math.round(weatherData.main.temp_min) + '°'} C
                    </p>
                  </div>
                </div>

                <div className="flex items-center">
                  <FaTint className="text-blue-500 mr-2" />
                  <div>
                    <p className="text-sm text-gray-600">Humidity</p>
                    <p className="font-medium">{weatherData.main.humidity}%</p>
                  </div>
                </div>

                <div className="flex items-center">
                  <FaWind className="text-gray-500 mr-2" />
                  <div>
                    <p className="text-sm text-gray-600">Wind</p>
                    <p className="font-medium">{weatherData.wind.speed} m/s</p>
                  </div>
                </div>

                <div className="flex items-center">
                  <FaCompass className="text-gray-500 mr-2" />
                  <div>
                    <p className="text-sm text-gray-600">Pressure</p>
                    <p className="font-medium">{weatherData.main.pressure} hPa</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Initial State */}
        {!loading && !weatherData && !error && (
          <div className="text-center py-12">
            <FaCloudSun className="text-6xl text-blue-400 mx-auto mb-4" />
            <p className="text-gray-600">
              Search for a city to see the current weather conditions.
            </p>
          </div>
        )}
        
        {/* Last Searched */}
        {lastSearched && (
          <div className="text-center mt-6 text-sm text-gray-500">
            <p>Last searched: {lastSearched}</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;