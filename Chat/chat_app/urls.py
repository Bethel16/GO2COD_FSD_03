from django.urls import path
from .views import UserProfileView
from .views import register_view , login_view

urlpatterns = [
    path('profile/', UserProfileView.as_view(), name='user_profile'),
    path('register/', register_view, name='register'),
    path('login/', login_view , name='login')


]
