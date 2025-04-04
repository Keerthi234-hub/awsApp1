import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useHistory } from 'react-router-dom';

function Profile() {
  const [bookings, setBookings] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [activeTab, setActiveTab] = useState('bookings');
  const history = useHistory();

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const [bookingsResponse, reviewsResponse] = await Promise.all([
        axios.get('/api/bookings/user/'),
        axios.get('/api/reviews/user/')
      ]);
      setBookings(bookingsResponse.data.results);
      setReviews(reviewsResponse.data.results);
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  const handleCancelBooking = async (bookingId) => {
    try {
      await axios.post(`/api/bookings/${bookingId}/cancel/`);
      fetchUserData();
    } catch (error) {
      console.error('Error canceling booking:', error);
    }
  };

  return (
    <div className="profile">
      <div className="profile-header">
        <h2>My Profile</h2>
        <div className="tabs">
          <button
            className={`tab ${activeTab === 'bookings' ? 'active' : ''}`}
            onClick={() => setActiveTab('bookings')}
          >
            My Bookings
          </button>
          <button
            className={`tab ${activeTab === 'reviews' ? 'active' : ''}`}
            onClick={() => setActiveTab('reviews')}
          >
            My Reviews
          </button>
        </div>
      </div>

      {activeTab === 'bookings' && (
        <div className="bookings-list">
          {bookings.map(booking => (
            <div key={booking.id} className="booking-card">
              <div className="booking-header">
                <h3>{booking.destination_name}</h3>
                <span className={`status ${booking.status}`}>{booking.status}</span>
              </div>
              <div className="booking-details">
                <p>Reference: {booking.booking_reference}</p>
                <p>Check-in: {new Date(booking.check_in_date).toLocaleDateString()}</p>
                <p>Check-out: {new Date(booking.check_out_date).toLocaleDateString()}</p>
                <p>Guests: {booking.number_of_people}</p>
                <p>Total: ${booking.total_price}</p>
              </div>
              <div className="booking-actions">
                {booking.status === 'pending' && (
                  <button 
                    className="btn-secondary"
                    onClick={() => handleCancelBooking(booking.id)}
                  >
                    Cancel Booking
                  </button>
                )}
                <button
                  className="btn-primary"
                  onClick={() => history.push(`/booking/${booking.id}`)}
                >
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'reviews' && (
        <div className="reviews-list">
          {reviews.map(review => (
            <div key={review.id} className="review-card">
              <h3>{review.destination_name}</h3>
              <div className="review-rating">{review.rating}/5</div>
              <h4>{review.title}</h4>
              <p>{review.comment}</p>
              <div className="review-date">
                Visited on {new Date(review.visit_date).toLocaleDateString()}
              </div>
              {review.images.length > 0 && (
                <div className="review-images">
                  {review.images.map(image => (
                    <img key={image.id} src={image.image} alt="Review" />
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Profile;