import React from 'react';
import { Link } from 'react-router-dom';

function DestinationCard({ destination }) {
  const primaryImage = destination.images.find(img => img.is_primary) || destination.images[0];

  return (
    <Link to={`/destination/${destination.id}`} className="destination-card">
      <div className="destination-image">
        <img src={primaryImage?.image} alt={destination.name} />
        <div className="rating-badge">{destination.rating}</div>
      </div>
      <div className="destination-info">
        <h3 className="destination-name">{destination.name}</h3>
        <p className="destination-location">
          {destination.district}, {destination.state}, {destination.country}
        </p>
        <div className="destination-amenities">
          {destination.amenities.slice(0, 3).map(amenity => (
            <span key={amenity.id} className="amenity-icon">
              <i className={amenity.icon}></i>
            </span>
          ))}
          {destination.amenities.length > 3 && (
            <span className="amenity-more">+{destination.amenities.length - 3}</span>
          )}
        </div>
      </div>
    </Link>
  );
}

export default DestinationCard;