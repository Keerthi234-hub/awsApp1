import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import DestinationCard from './DestinationCard';

function Home() {
  const [popularDestinations, setPopularDestinations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPopularDestinations = async () => {
      try {
        const response = await axios.get('/api/destinations/popular/');
        setPopularDestinations(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching popular destinations:', error);
        setLoading(false);
      }
    };

    fetchPopularDestinations();
  }, []);

  return (
    <div className="home">
      <div className="hero">
        <h1>Discover Your Next Adventure</h1>
        <p>Explore amazing destinations and create unforgettable memories</p>
        <Link to="/search" className="btn-primary">Start Exploring</Link>
      </div>

      <section className="popular-destinations">
        <h2>Popular Destinations</h2>
        {loading ? (
          <div>Loading...</div>
        ) : (
          <div className="destinations-grid">
            {popularDestinations.map(destination => (
              <DestinationCard key={destination.id} destination={destination} />
            ))}
          </div>
        )}
      </section>

      <section className="features">
        <div className="feature">
          <i className="fas fa-map-marker-alt"></i>
          <h3>Find Perfect Locations</h3>
          <p>Discover handpicked destinations tailored to your interests</p>
        </div>
        <div className="feature">
          <i className="fas fa-calendar-alt"></i>
          <h3>Easy Booking</h3>
          <p>Simple and secure booking process with instant confirmation</p>
        </div>
        <div className="feature">
          <i className="fas fa-star"></i>
          <h3>Real Reviews</h3>
          <p>Read authentic reviews from real travelers</p>
        </div>
      </section>
    </div>
  );
}

export default Home;