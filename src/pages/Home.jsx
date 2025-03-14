import React, { useState, useEffect } from 'react';
import SearchBar from '../components/SearchBar';
import WeatherCard from '../components/WeatherCard';
import { fetchCurrentWeather } from '../api/weatherAPI';
import { FaCloudSun } from 'react-icons/fa';

const Home = () => {
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [lastSearched, setLastSearched] = useState('');

  // Load last searched city from localStorage on component mount
  useEffect(() => {
    const savedCity = localStorage.getItem('lastSearchedCity');
    if (savedCity) {
      handleSearch(savedCity);
      setLastSearched(savedCity);
    }
  }, []);

  const handleSearch = async (city) => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await fetchCurrentWeather(city);
      setWeatherData(data);
      setLastSearched(city);
      
      // Save to localStorage
      localStorage.setItem('lastSearchedCity', city);
    } catch (err) {
      console.error('Error fetching weather data:', err);
      
      if (err.response && err.response.status === 404) {
        setError('City not found. Please try another location.');
      } else {
        setError('Failed to fetch weather data. Please try again later.');
      }
      
      setWeatherData(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* App Header */}
        <div className="flex items-center justify-center mb-8">
          <FaCloudSun className="text-4xl text-blue-500 mr-2" />
          <h1 className="text-3xl font-bold text-gray-800">Weather Dashboard</h1>
        </div>
        
        {/* Search Bar */}
        <SearchBar onSearch={handleSearch} />
        
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
        
        {/* Weather Data */}
        {weatherData && <WeatherCard weatherData={weatherData} />}
        
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
};

export default Home;