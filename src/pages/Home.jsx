import React, { useState, useEffect } from 'react';
import SearchBar from '../components/SearchBar';
import WeatherCard from '../components/WeatherCard';
import { fetchCurrentWeather } from '../api/weatherAPI';

const Home = () => {
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [lastSearched, setLastSearched] = useState('');
  const [spinFrame, setSpinFrame] = useState(0);

  const spinFrames = ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏'];

  useEffect(() => {
    const savedCity = localStorage.getItem('lastSearchedCity');
    if (savedCity) {
      handleSearch(savedCity);
    }
  }, []);

  useEffect(() => {
    if (!loading) return;
    const t = setInterval(() => setSpinFrame(f => (f + 1) % spinFrames.length), 80);
    return () => clearInterval(t);
  }, [loading]);

  const handleSearch = async (city) => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchCurrentWeather(city);
      setWeatherData(data);
      setLastSearched(city);
      localStorage.setItem('lastSearchedCity', city);
    } catch (err) {
      const status = err.response?.status;
      if (status === 404) {
        setError(`"${city}" not found`);
      } else if (status === 401) {
        setError('invalid API key — check REACT_APP_WEATHER_API_KEY in .env');
      } else {
        setError('failed to fetch — try again later');
      }
      setWeatherData(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-shell">
      <header className="app-header">
        <div className="header-path">
          <span>~</span>
          <span className="path-sep">/</span>
          <span className="path-current">weather</span>
        </div>
        <div className="header-status">
          <span className="status-dot" />
          <span>live</span>
        </div>
      </header>

      <main>
        <div className="title-block">
          <h1 className="app-title">
            <span className="t-accent">W</span>eather
          </h1>
          <p className="app-sub">current conditions</p>
        </div>

        <SearchBar onSearch={handleSearch} />

        {loading && (
          <div className="status-line">
            <span>{spinFrames[spinFrame]}</span>
            <span>fetching weather data...</span>
          </div>
        )}

        {error && (
          <div className="error-line">
            <span>✗</span>
            <span>{error}</span>
          </div>
        )}

        {weatherData && !loading && (
          <WeatherCard weatherData={weatherData} />
        )}

        {!loading && !weatherData && !error && (
          <div className="empty-state">
            <div className="empty-glyph">◎</div>
            <p className="empty-text">enter a city name above</p>
            <p className="empty-hint">try "tokyo", "new york", or "london"</p>
          </div>
        )}
      </main>

      {lastSearched && (
        <footer className="app-footer">
          <span className="footer-last">
            last searched: <span className="footer-city">{lastSearched.toLowerCase()}</span>
          </span>
          <span>openweathermap</span>
        </footer>
      )}
    </div>
  );
};

export default Home;
