import googlemaps
from django.conf import settings
from .models import Destination

class LocationRecommender:
    def __init__(self):
        self.gmaps = googlemaps.Client(key=settings.GOOGLE_MAPS_API_KEY)

    def get_nearby_places(self, latitude, longitude, radius=5000):
        """Get nearby tourist attractions using Google Places API."""
        places_result = self.gmaps.places_nearby(
            location=(latitude, longitude),
            radius=radius,
            type='tourist_attraction'
        )
        return places_result.get('results', [])

    def get_recommendations(self, destination):
        """Get recommendations based on a destination."""
        nearby_places = self.get_nearby_places(
            float(destination.latitude),
            float(destination.longitude)
        )
        
        recommendations = []
        for place in nearby_places:
            if place['name'] != destination.name:  # Exclude the current destination
                recommendations.append({
                    'name': place['name'],
                    'rating': place.get('rating', 0),
                    'vicinity': place.get('vicinity', ''),
                    'place_id': place['place_id']
                })
        
        return recommendations[:5]  # Return top 5 recommendations