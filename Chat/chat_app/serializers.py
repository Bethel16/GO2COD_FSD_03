
      
from django.contrib.auth.models import User
from rest_framework import serializers

from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Profile , ChatRoom, Message

# Profile Serializer to handle profile attributes
class ProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = Profile
        fields = ['profile_image', 'bio']  # Profile-specific fields

# User Serializer to handle user attributes, including the profile
class UserProfileSerializer(serializers.ModelSerializer):
    # Include the Profile serializer as a nested field
    profile = ProfileSerializer()

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'profile']  # Include Profile as nested field


class UserRegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    password2 = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ['username', 'email', 'first_name', 'last_name', 'password', 'password2']

    def validate(self, attrs):
        """
        Check that the two passwords match
        """
        if attrs['password'] != attrs['password2']:
            raise serializers.ValidationError("Passwords don't match.")
        return attrs

    def create(self, validated_data):
        """
        Create and return a new user instance, with hashed password
        """
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            first_name=validated_data['first_name'],
            last_name=validated_data['last_name'],
            password=validated_data['password']
        )
        return user


class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['username', 'email', 'first_name', 'last_name', 'profile_image', 'bio']

class UserSerializer(serializers.ModelSerializer):
    profile = ProfileSerializer()

    class Meta:
        model = User
        fields = ['id', 'username', 'profile']
class ChatRoomSerializer(serializers.ModelSerializer):
    users = UserSerializer(many=True)

    class Meta:
        model = ChatRoom
        fields = ['id', 'name', 'users', 'created_at']

class MessageSerializer(serializers.ModelSerializer):
    user = UserSerializer()

    class Meta:
        model = Message
        fields = ['id', 'user', 'content', 'timestamp']