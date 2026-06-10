import React from 'react';
import { getWeatherIconUrl, formatDate, formatTime } from '../api/weatherAPI';

const WeatherCard = ({ weatherData }) => {
  if (!weatherData) return null;

  const { name, sys, main, weather, wind, dt } = weatherData;
  const w = weather[0];

  return (
    <div className="weather-card">
      <div className="card-header">
        <div className="card-location">
          <div className="card-city">{name}</div>
          <div className="card-meta">
            <span>{sys.country}</span>
            <span className="meta-sep">·</span>
            <span>{formatDate(dt)}</span>
          </div>
        </div>
        <div className="card-temp-block">
          <div className="card-temp">
            {Math.round(main.temp)}
            <span className="card-temp-unit">°C</span>
          </div>
          <div className="card-feels">feels like {Math.round(main.feels_like)}°</div>
        </div>
      </div>

      <div className="card-desc-row">
        <img
          className="card-icon"
          src={getWeatherIconUrl(w.icon)}
          alt={w.description}
        />
        <span className="card-description">{w.description}</span>
        <span className="card-updated">updated {formatTime(dt)}</span>
      </div>

      <div className="card-stats">
        <div className="stat-cell">
          <div className="stat-label">humidity</div>
          <div className="stat-value">
            {main.humidity}
            <span className="stat-unit">%</span>
          </div>
        </div>

        <div className="stat-cell">
          <div className="stat-label">wind</div>
          <div className="stat-value">
            {wind.speed}
            <span className="stat-unit">m/s</span>
          </div>
        </div>

        <div className="stat-cell">
          <div className="stat-label">pressure</div>
          <div className="stat-value">
            {main.pressure}
            <span className="stat-unit">hPa</span>
          </div>
        </div>

        <div className="stat-cell">
          <div className="stat-label">high / low</div>
          <div className="stat-value" style={{ fontSize: '13px', paddingTop: '3px' }}>
            <span className="hi">{Math.round(main.temp_max)}°</span>
            {' '}
            <span style={{ color: 'var(--text-muted)' }}>/</span>
            {' '}
            <span className="lo">{Math.round(main.temp_min)}°</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WeatherCard;
