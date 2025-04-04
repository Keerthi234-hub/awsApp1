import React, { useState, useEffect } from 'react';
import axios from 'axios';

function SearchFilters({ filters, onFilterChange }) {
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [districts, setDistricts] = useState([]);

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const response = await axios.get('/api/destinations/locations/');
        setCountries(response.data.countries);
        setStates(response.data.states);
        setDistricts(response.data.districts);
      } catch (error) {
        console.error('Error fetching locations:', error);
      }
    };

    fetchLocations();
  }, []);

  return (
    <div className="search-filters">
      <div className="filter-group">
        <input
          type="text"
          placeholder="Search destinations..."
          value={filters.query}
          onChange={(e) => onFilterChange({ query: e.target.value })}
          className="search-input"
        />
      </div>

      <div className="filter-group">
        <select
          value={filters.country}
          onChange={(e) => onFilterChange({ country: e.target.value })}
          className="filter-select"
        >
          <option value="">Select Country</option>
          {countries.map(country => (
            <option key={country} value={country}>{country}</option>
          ))}
        </select>

        <select
          value={filters.state}
          onChange={(e) => onFilterChange({ state: e.target.value })}
          className="filter-select"
        >
          <option value="">Select State</option>
          {states.map(state => (
            <option key={state} value={state}>{state}</option>
          ))}
        </select>

        <select
          value={filters.district}
          onChange={(e) => onFilterChange({ district: e.target.value })}
          className="filter-select"
        >
          <option value="">Select District</option>
          {districts.map(district => (
            <option key={district} value={district}>{district}</option>
          ))}
        </select>
      </div>
    </div>
  );
}

export default SearchFilters;