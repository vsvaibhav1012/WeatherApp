import React, { useState, useEffect } from 'react';
import { FaSearch } from 'react-icons/fa';

const SearchBar = ({ onSearch }) => {
  const [city, setCity] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (city.length < 2) {
        setSuggestions([]);
        return;
      }

      setIsLoading(true);
      try {
        // You'll need to replace this URL with your actual API endpoint
        // This endpoint should connect to your backend which handles OpenWeather API calls
        const response = await fetch(`/api/city-suggestions?q=${encodeURIComponent(city)}`);
        
        if (response.ok) {
          const data = await response.json();
          setSuggestions(data);
        } else {
          console.error('Failed to fetch suggestions');
          setSuggestions([]);
        }
      } catch (error) {
        console.error('Error fetching suggestions:', error);
        setSuggestions([]);
      } finally {
        setIsLoading(false);
      }
    };

    // Debounce the API call to prevent excessive requests
    const timer = setTimeout(() => {
      if (city.trim()) {
        fetchSuggestions();
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [city]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (city.trim()) {
      onSearch(city.trim());
      setCity('');
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setCity(suggestion.name);
    onSearch(suggestion.name);
    setShowSuggestions(false);
  };

  return (
    <div className="relative w-full max-w-md mx-auto mb-6">
      <form onSubmit={handleSubmit} className="flex items-center w-full">
        <div className="relative w-full">
          <input
            type="text"
            placeholder="Search for a city..."
            className="w-full py-3 pl-4 pr-12 text-sm text-gray-700 bg-white border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={city}
            onChange={(e) => {
              setCity(e.target.value);
              setShowSuggestions(true);
            }}
            onFocus={() => setShowSuggestions(true)}
          />
          <button
            type="submit"
            className="absolute inset-y-0 right-0 flex items-center justify-center w-12 text-white bg-blue-500 rounded-r-lg hover:bg-blue-600"
          >
            <FaSearch />
          </button>
        </div>
      </form>

      {showSuggestions && city.length >= 2 && (
        <div className="absolute z-10 w-full mt-1 bg-white border rounded-lg shadow-lg">
          {isLoading ? (
            <div className="p-3 text-center text-gray-500">Loading suggestions...</div>
          ) : suggestions.length > 0 ? (
            <ul>
              {suggestions.map((suggestion, index) => (
                <li
                  key={`${suggestion.name}-${suggestion.country}-${index}`}
                  className="px-4 py-2 cursor-pointer hover:bg-blue-50"
                  onClick={() => handleSuggestionClick(suggestion)}
                >
                  {suggestion.name}, {suggestion.country}
                </li>
              ))}
            </ul>
          ) : city.length >= 2 ? (
            <div className="p-3 text-center text-gray-500">No cities found</div>
          ) : null}
        </div>
      )}
    </div>
  );
};

export default SearchBar;