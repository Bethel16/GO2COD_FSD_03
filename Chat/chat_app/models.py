from django.db import models
from django.contrib.auth.models import User

class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)  # links the profile to the user
    profile_image = models.ImageField(upload_to='profile_pics/', default='default.jpg')  # store profile pics
    bio = models.TextField(blank=True, null=True)  # optional bio field

    def __str__(self):
        return f'{self.user.username} Profile'


    def save(self, *args, **kwargs):
        # You can add additional logic to handle automatic saving of user field
        super().save(*args, **kwargs)

class ChatRoom(models.Model):
    users = models.ManyToManyField(User, related_name='chatrooms')
    name = models.CharField(max_length=255, unique=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name

    @staticmethod
    def get_or_create_room(user1, user2):
        room_name = f"chat_{min(user1.id, user2.id)}_{max(user1.id, user2.id)}"
        room, created = ChatRoom.objects.get_or_create(name=room_name)
        room.users.add(user1, user2)
        return room


class Message(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    room = models.ForeignKey(ChatRoom, on_delete=models.CASCADE, related_name="messages")
    content = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.username}: {self.content[:20]}"