"""
Serializers for the accounts app.
Handles user registration and validation.
"""
from rest_framework import serializers
from django.contrib.auth.models import User


class UserRegistrationSerializer(serializers.ModelSerializer):
    """
    Serializer for user registration.
    Validates username uniqueness and handles password hashing.
    """
    password = serializers.CharField(write_only=True, min_length=8)
    
    class Meta:
        model = User
        fields = ('username', 'password')
    
    def validate_username(self, value):
        """
        Check if username already exists in the database.
        """
        if User.objects.filter(username=value).exists():
            raise serializers.ValidationError("Username already exists.")
        return value
    
    def create(self, validated_data):
        """
        Create a new user with a hashed password.
        """
        user = User.objects.create_user(
            username=validated_data['username'],
            password=validated_data['password']
        )
        return user

