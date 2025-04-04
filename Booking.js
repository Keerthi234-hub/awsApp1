import React, { useState, useEffect } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import axios from 'axios';

function Booking() {
  const { destinationId } = useParams();
  const history = useHistory();
  const [booking, setBooking] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('credit_card');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBooking = async () => {
      try {
        const response = await axios.get(`/api/bookings/${destinationId}/`);
        setBooking(response.data);
        setLoading(false);
      } catch (error) {
        setError('Error fetching booking details');
        setLoading(false);
      }
    };

    fetchBooking();
  }, [destinationId]);

  const handlePayment = async () => {
    try {
      const response = await axios.post(`/api/bookings/${destinationId}/payment/`, {
        payment_method: paymentMethod
      });

      if (response.data.status === 'completed') {
        history.push(`/profile`);
      } else {
        setError('Payment processing failed. Please try again.');
      }
    } catch (error) {
      setError('Error processing payment');
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!booking) return <div>Booking not found</div>;

  return (
    <div className="booking-confirmation">
      <h2>Booking Confirmation</h2>
      
      <div className="booking-details">
        <h3>Destination: {booking.destination_name}</h3>
        <div className="details-grid">
          <div className="detail-item">
            <label>Check-in:</label>
            <span>{new Date(booking.check_in_date).toLocaleDateString()}</span>
          </div>
          <div className="detail-item">
            <label>Check-out:</label>
            <span>{new Date(booking.check_out_date).toLocaleDateString()}</span>
          </div>
          <div className="detail-item">
            <label>Guests:</label>
            <span>{booking.number_of_people}</span>
          </div>
          <div className="detail-item">
            <label>Booking Reference:</label>
            <span>{booking.booking_reference}</span>
          </div>
        </div>
      </div>

      <div className="payment-section">
        <h3>Payment Details</h3>
        <div className="price-summary">
          <div className="price-item">
            <span>Total Amount:</span>
            <span className="price">${booking.total_price}</span>
          </div>
        </div>

        <div className="payment-method">
          <h4>Select Payment Method</h4>
          <div className="payment-options">
            <label>
              <input
                type="radio"
                value="credit_card"
                checked={paymentMethod === 'credit_card'}
                onChange={(e) => setPaymentMethod(e.target.value)}
              />
              Credit Card
            </label>
            <label>
              <input
                type="radio"
                value="paypal"
                checked={paymentMethod === 'paypal'}
                onChange={(e) => setPaymentMethod(e.target.value)}
              />
              PayPal
            </label>
          </div>
        </div>

        <button 
          className="btn-primary btn-large"
          onClick={handlePayment}
        >
          Proceed to Payment
        </button>
      </div>
    </div>
  );
}

export default Booking;