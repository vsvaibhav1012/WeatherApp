import React, { useState, useEffect, useRef } from 'react';

const SearchBar = ({ onSearch }) => {
  const [city, setCity] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef(null);
  const wrapperRef = useRef(null);

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (city.length < 2) {
        setSuggestions([]);
        return;
      }
      setIsLoading(true);
      try {
        const response = await fetch(`/api/city-suggestions?q=${encodeURIComponent(city)}`);
        if (response.ok) {
          const data = await response.json();
          setSuggestions(data);
        } else {
          setSuggestions([]);
        }
      } catch {
        setSuggestions([]);
      } finally {
        setIsLoading(false);
      }
    };

    const timer = setTimeout(() => {
      if (city.trim()) fetchSuggestions();
    }, 300);
    return () => clearTimeout(timer);
  }, [city]);

  useEffect(() => {
    const handler = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (city.trim()) {
      onSearch(city.trim());
      setCity('');
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    onSearch(suggestion.name);
    setCity('');
    setShowSuggestions(false);
  };

  const hasSuggestions = showSuggestions && city.length >= 2;

  return (
    <div className="search-wrapper" ref={wrapperRef}>
      <form className="search-form" onSubmit={handleSubmit}>
        <span className="search-prompt">›</span>
        <input
          ref={inputRef}
          type="text"
          className="search-input"
          placeholder="city name..."
          value={city}
          onChange={(e) => {
            setCity(e.target.value);
            setShowSuggestions(true);
          }}
          onFocus={() => setShowSuggestions(true)}
          autoComplete="off"
          spellCheck={false}
        />
        <button type="submit" className="search-btn">run</button>
      </form>

      {hasSuggestions && (
        <div className="suggestions-list">
          {isLoading ? (
            <div className="suggestions-empty">loading...</div>
          ) : suggestions.length > 0 ? (
            suggestions.map((s, i) => (
              <div
                key={`${s.name}-${s.country}-${i}`}
                className="suggestion-item"
                onMouseDown={() => handleSuggestionClick(s)}
              >
                <span>{s.name}</span>
                <span className="suggestion-country">{s.country}</span>
              </div>
            ))
          ) : (
            <div className="suggestions-empty">no results</div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
