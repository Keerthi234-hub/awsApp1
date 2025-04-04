from rest_framework import viewsets, permissions, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from .models import Destination, Review, Booking
from .serializers import DestinationSerializer, ReviewSerializer, BookingSerializer
from .recommendations import LocationRecommender
from .availability import AvailabilityChecker

class DestinationViewSet(viewsets.ModelViewSet):
    queryset = Destination.objects.all()
    serializer_class = DestinationSerializer
    filter_backends = [filters.SearchFilter]
    search_fields = ['name', 'country', 'state', 'district']
    
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.recommender = LocationRecommender()
    
    @action(detail=True, methods=['get'])
    def recommendations(self, request, pk=None):
        destination = self.get_object()
        recommendations = self.recommender.get_recommendations(destination)
        return Response(recommendations)
        
    @action(detail=True, methods=['get'])
    def check_availability(self, request, pk=None):
        destination = self.get_object()
        date = request.query_params.get('date')
        num_people = int(request.query_params.get('num_people', 1))
        
        if not date:
            return Response(
                {'error': 'Date parameter is required'},
                status=400
            )
            
        checker = AvailabilityChecker()
        availability = checker.check_availability(
            destination,
            date,
            num_people
        )
        return Response(availability)
    
    @action(detail=True, methods=['post'])
    def add_review(self, request, pk=None):
        destination = self.get_object()
        serializer = ReviewSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(destination=destination, user=request.user)
            return Response(serializer.data)
        return Response(serializer.errors, status=400)

class BookingViewSet(viewsets.ModelViewSet):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = BookingSerializer
    
    def get_queryset(self):
        return Booking.objects.filter(user=self.request.user)
    
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class ReviewViewSet(viewsets.ModelViewSet):
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    serializer_class = ReviewSerializer
    
    def get_queryset(self):
        return Review.objects.all()