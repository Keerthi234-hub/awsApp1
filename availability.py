from datetime import datetime, timedelta
from .models import Booking

class AvailabilityChecker:
    def check_availability(self, destination, date, num_people):
        """
        Check if a destination is available for booking on a specific date
        for the specified number of people.
        """
        # Get all bookings for the destination on the specified date
        bookings = Booking.objects.filter(
            destination=destination,
            visit_date=date,
            status='confirmed'
        )
        
        # Calculate total booked capacity for the day
        total_booked = sum(booking.number_of_people for booking in bookings)
        
        # Assume each destination has a daily capacity of 100 people
        MAX_DAILY_CAPACITY = 100
        
        return {
            'available': (total_booked + num_people) <= MAX_DAILY_CAPACITY,
            'remaining_capacity': MAX_DAILY_CAPACITY - total_booked,
            'next_available_date': self.find_next_available_date(destination, num_people)
        }
    
    def find_next_available_date(self, destination, num_people):
        """Find the next available date if current date is fully booked."""
        current_date = datetime.now().date()
        
        for i in range(30):  # Look up to 30 days ahead
            check_date = current_date + timedelta(days=i)
            bookings = Booking.objects.filter(
                destination=destination,
                visit_date=check_date,
                status='confirmed'
            )
            total_booked = sum(booking.number_of_people for booking in bookings)
            
            if (total_booked + num_people) <= 100:
                return check_date
        
        return None  # No availability in the next 30 days