from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import DestinationViewSet, BookingViewSet, ReviewViewSet

router = DefaultRouter()
router.register(r'destinations', DestinationViewSet)
router.register(r'bookings', BookingViewSet, basename='booking')
router.register(r'reviews', ReviewViewSet, basename='review')

urlpatterns = [
    path('', include(router.urls)),
]