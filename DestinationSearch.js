import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import SearchFilters from './SearchFilters';
import DestinationCard from './DestinationCard';

function DestinationSearch() {
  const [destinations, setDestinations] = useState([]);
  const [filters, setFilters] = useState({
    country: '',
    state: '',
    district: '',
    query: ''
  });
  
  const mapContainerStyle = {
    width: '100%',
    height: '400px'
  };
  
  const center = {
    lat: 20,
    lng: 0
  };

  useEffect(() => {
    const fetchDestinations = async () => {
      try {
        const params = new URLSearchParams(filters);
        const response = await axios.get(`/api/destinations/search/?${params}`);
        setDestinations(response.data.results);
      } catch (error) {
        console.error('Error fetching destinations:', error);
      }
    };

    fetchDestinations();
  }, [filters]);

  const handleFilterChange = (newFilters) => {
    setFilters({ ...filters, ...newFilters });
  };

  return (
    <div className="destination-search">
      <SearchFilters filters={filters} onFilterChange={handleFilterChange} />
      
      <div className="map-container">
        <LoadScript googleMapsApiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY}>
          <GoogleMap
            mapContainerStyle={mapContainerStyle}
            center={center}
            zoom={2}
          >
            {destinations.map(destination => (
              <Marker
                key={destination.id}
                position={{
                  lat: parseFloat(destination.latitude),
                  lng: parseFloat(destination.longitude)
                }}
                title={destination.name}
              />
            ))}
          </GoogleMap>
        </LoadScript>
      </div>

      <div className="destinations-grid">
        {destinations.map(destination => (
          <DestinationCard key={destination.id} destination={destination} />
        ))}
      </div>
    </div>
  );
}

export default DestinationSearch;