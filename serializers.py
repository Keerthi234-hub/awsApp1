from rest_framework import serializers
from .models import Destination, Review, Booking, DestinationImage
from django.contrib.auth.models import User

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email']

class DestinationImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = DestinationImage
        fields = ['id', 'image', 'is_primary']

class ReviewSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    
    class Meta:
        model = Review
        fields = ['id', 'user', 'rating', 'comment', 'created_at']
        read_only_fields = ['user']

class DestinationSerializer(serializers.ModelSerializer):
    images = DestinationImageSerializer(many=True, read_only=True)
    reviews = ReviewSerializer(many=True, read_only=True)
    average_rating = serializers.SerializerMethodField()
    primary_image = serializers.SerializerMethodField()

    class Meta:
        model = Destination
        fields = ['id', 'name', 'country', 'state', 'district', 'description',
                 'latitude', 'longitude', 'rating', 'images', 'reviews',
                 'average_rating', 'primary_image', 'created_at']

    def get_average_rating(self, obj):
        reviews = obj.reviews.all()
        if not reviews:
            return 0
        return sum(review.rating for review in reviews) / len(reviews)

    def get_primary_image(self, obj):
        primary_image = obj.images.filter(is_primary=True).first()
        if primary_image:
            return self.context['request'].build_absolute_uri(primary_image.image.url)
        return None

class BookingSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    destination = DestinationSerializer(read_only=True)
    destination_id = serializers.PrimaryKeyRelatedField(
        queryset=Destination.objects.all(),
        write_only=True,
        source='destination'
    )

    class Meta:
        model = Booking
        fields = ['id', 'user', 'destination', 'destination_id', 'visit_date',
                 'number_of_people', 'total_price', 'status', 'created_at']
        read_only_fields = ['user', 'status', 'total_price']