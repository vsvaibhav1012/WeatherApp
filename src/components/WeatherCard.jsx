import React from 'react';
import { FaWind, FaThermometerHalf, FaTint, FaCompass } from 'react-icons/fa';
import { getWeatherIconUrl, formatDate, formatTime } from '../api/weatherAPI';

const WeatherCard = ({ weatherData }) => {
  if (!weatherData) return null;

  return (
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
                {Math.round(weatherData.main.temp_max)}° / {Math.round(weatherData.main.temp_min)}°C
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
  );
};

export default WeatherCard;