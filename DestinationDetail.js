import React, { useState, useEffect } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import axios from 'axios';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import ReviewList from './ReviewList';
import BookingForm from './BookingForm';

function DestinationDetail() {
  const { id } = useParams();
  const history = useHistory();
  const [destination, setDestination] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  
  const mapContainerStyle = {
    width: '100%',
    height: '300px'
  };

  useEffect(() => {
    const fetchDestination = async () => {
      try {
        const response = await axios.get(`/api/destinations/${id}/`);
        setDestination(response.data);
        if (response.data.images.length > 0) {
          setSelectedImage(response.data.images[0]);
        }
      } catch (error) {
        console.error('Error fetching destination:', error);
      }
    };

    fetchDestination();
  }, [id]);

  if (!destination) {
    return <div>Loading...</div>;
  }

  return (
    <div className="destination-detail">
      <div className="destination-header">
        <h1>{destination.name}</h1>
        <div className="location">
          {destination.district}, {destination.state}, {destination.country}
        </div>
        <div className="rating">Rating: {destination.rating}/5</div>
      </div>

      <div className="destination-images">
        <div className="main-image">
          <img src={selectedImage?.image} alt={destination.name} />
        </div>
        <div className="image-thumbnails">
          {destination.images.map(image => (
            <img
              key={image.id}
              src={image.image}
              alt={destination.name}
              onClick={() => setSelectedImage(image)}
              className={selectedImage?.id === image.id ? 'selected' : ''}
            />
          ))}
        </div>
      </div>

      <div className="destination-info">
        <div className="description">{destination.description}</div>
        
        <div className="amenities">
          <h3>Amenities</h3>
          <div className="amenities-grid">
            {destination.amenities.map(amenity => (
              <div key={amenity.id} className="amenity">
                <i className={amenity.icon}></i>
                <span>{amenity.name}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="map">
          <LoadScript googleMapsApiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY}>
            <GoogleMap
              mapContainerStyle={mapContainerStyle}
              center={{
                lat: parseFloat(destination.latitude),
                lng: parseFloat(destination.longitude)
              }}
              zoom={12}
            >
              <Marker
                position={{
                  lat: parseFloat(destination.latitude),
                  lng: parseFloat(destination.longitude)
                }}
                title={destination.name}
              />
            </GoogleMap>
          </LoadScript>
        </div>

        <BookingForm destination={destination} />

        <div className="reviews-section">
          <h3>Reviews</h3>
          <ReviewList destinationId={destination.id} />
        </div>
      </div>
    </div>
  );
}

export default DestinationDetail;