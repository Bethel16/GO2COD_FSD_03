from django.urls import path
from .views import UserProfileView, register_view , login_view ,  user_list_view, chat_room_create_view, chat_room_messages_view, send_message_view
from django.conf import settings
from django.conf.urls.static import static
urlpatterns = [
    path('profile/', UserProfileView.as_view(), name='user_profile'),
    path('register/', register_view, name='register'),
    path('login/', login_view , name='login'),
     path('users/', user_list_view, name='user-list'),
    path('chat-room/create/', chat_room_create_view, name='chat-room-create'),
    path('chat-room/<int:room_id>/messages/', chat_room_messages_view, name='chat-room-messages'),
    path('chat-room/send-message/', send_message_view, name='send-message'),

    
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
