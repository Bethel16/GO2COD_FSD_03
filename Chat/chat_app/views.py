from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import Profile
from .serializers import ProfileSerializer
from django.contrib.auth import authenticate, login

class UserProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        profile = Profile.objects.get(user=request.user)
        serializer = ProfileSerializer(profile)
        return Response(serializer.data)

    def put(self, request):
        profile = Profile.objects.get(user=request.user)
        serializer = ProfileSerializer(profile, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=400)

import json
from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse
from django.contrib.auth.models import User
from .models import Profile


@csrf_exempt
def register_view(request):
    try:
        print("start")
        # Use request.POST and request.FILES for multipart data
        username = request.POST.get('username')
        password = request.POST.get('password')
        first_name = request.POST.get('first_name')
        last_name = request.POST.get('last_name')
        email = request.POST.get('email')

        # Ensure all required fields are provided
        if not all([username, password, first_name, last_name, email]):
            return JsonResponse({'error': 'Missing required fields.'}, status=400)
        
        # Create the user
        user = User.objects.create_user(
            username=username,
            password=password,
            first_name=first_name,
            last_name=last_name,
            email=email
        )

        return JsonResponse({
            'message': 'User registered successfully!',
            'id': user.id,
            'username': user.username,
            'email': user.email,
        }, status=201)

    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)

import json
from django.contrib.auth import authenticate, login
from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse
from rest_framework_simplejwt.tokens import RefreshToken
from .serializers import ProfileSerializer

@csrf_exempt
def login_view(request):
    if request.method == "POST":
        data = json.loads(request.body)
        username = data.get('username')
        password = data.get('password')

        user = authenticate(username=username, password=password)
        if user is not None:
            login(request, user)

            # Generate JWT tokens
            refresh = RefreshToken.for_user(user)
            access_token = str(refresh.access_token)
            refresh_token = str(refresh)

            # Get profile data if available
            profile_data = ProfileSerializer(user.profile).data if hasattr(user, 'profile') else {}

            return JsonResponse({
                'message': 'Login successful',
                'username': user.username,
                'email': user.email,
                'first_name': user.first_name,
                'last_name': user.last_name,
                'profile': profile_data,
                'access_token': access_token,
                'refresh_token': refresh_token
            })

        return JsonResponse({'error': 'Invalid credentials'}, status=401)

    return JsonResponse({'error': 'POST request required'}, status=400)

import json
from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse
from django.shortcuts import get_object_or_404
from django.contrib.auth.models import User
from .models import Profile, ChatRoom, Message
from .serializers import ProfileSerializer, UserSerializer, ChatRoomSerializer, MessageSerializer

@csrf_exempt
def user_list_view(request):
    """
    Custom view to list all users.
    """
    if request.method == "GET":
        try:
            users = User.objects.all()
            users_data = [UserSerializer(user).data for user in users]
            return JsonResponse(users_data, safe=False, status=200)
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)

    return JsonResponse({'error': 'GET request required'}, status=400)


@csrf_exempt
def chat_room_create_view(request):
    """
    Custom view to create a chat room between two users.
    """
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            user1 = get_object_or_404(User, id=data['user1'])
            user2 = get_object_or_404(User, id=data['user2'])

            # Use ChatRoom's get_or_create_room method (or create manually if not implemented)
            room, created = ChatRoom.objects.get_or_create(name=f"{user1.username}_{user2.username}")
            room_data = ChatRoomSerializer(room).data

            return JsonResponse({'room': room_data, 'created': created}, status=201)
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)

    return JsonResponse({'error': 'POST request required'}, status=400)


@csrf_exempt
def chat_room_messages_view(request, room_id):
    """
    Custom view to fetch messages for a specific chat room.
    """
    if request.method == "GET":
        try:
            room = get_object_or_404(ChatRoom, id=room_id)
            messages = Message.objects.filter(room=room).order_by('timestamp')
            messages_data = [MessageSerializer(message).data for message in messages]

            return JsonResponse({'messages': messages_data}, status=200)
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)

    return JsonResponse({'error': 'GET request required'}, status=400)


@csrf_exempt
def send_message_view(request):
    """
    Custom view to send a message to a chat room.
    """
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            room = get_object_or_404(ChatRoom, id=data['room_id'])
            user = get_object_or_404(User, id=data['user_id'])

            message = Message.objects.create(room=room, user=user, content=data['content'])
            message_data = MessageSerializer(message).data

            return JsonResponse({'message': message_data}, status=201)
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)

    return JsonResponse({'error': 'POST request required'}, status=400)
