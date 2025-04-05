from django.contrib.auth.models import AbstractUser
from django.db import models
import uuid

class CustomUser(AbstractUser):
    phone = models.CharField(max_length=15, unique=True, blank=False, null=False)
    email = models.EmailField(unique=True, blank=False, null=False)
    first_name = models.CharField(max_length=150, blank=False, null=False)
    last_name = models.CharField(max_length=150, blank=False, null=False)
    profile_image = models.ImageField(
        upload_to="profile_images/",
        default="profile_images/default.png",  
        blank=True
    )

    def __str__(self):
        return self.username


class Category(models.Model):
    id = models.BigAutoField(primary_key=True)
    name = models.CharField(null=True, max_length=255)
    code = models.CharField(max_length=255)
    parent = models.ForeignKey(
        'self',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='children'
    )

    def __str__(self):
        return f"{self.code} ({self.id})"


class User(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    username = models.CharField(max_length=255, unique=True)
    name = models.CharField(max_length=255, null=True, blank=True)
    first_name = models.CharField(max_length=255, null=True, blank=True)
    last_name = models.CharField(max_length=255, null=True, blank=True)
    middle_name = models.CharField(max_length=255, null=True, blank=True)
    phone_number = models.CharField(max_length=20, null=True, blank=True)
    email = models.EmailField(null=True, blank=True)
    password = models.CharField(max_length=255)
    link_telegram = models.CharField(max_length=255, null=True, blank=True)
    link_instagram = models.CharField(max_length=255, null=True, blank=True)
    link_whatsapp = models.CharField(max_length=255, null=True, blank=True)
    # profile_photo связана через UserPhoto ниже (is_main=True)

    def __str__(self):
        return self.username


class UserPhoto(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    name = models.CharField(max_length=255, null=True, blank=True)
    image = models.ImageField(upload_to='user_photos/')
    created_at = models.DateTimeField(auto_now_add=True)
    is_main = models.BooleanField(default=False)

    def __str__(self):
        return self.name or str(self.id)


class Event(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    title = models.CharField(max_length=255)
    description = models.TextField(null=True, blank=True)
    date = models.DateField(null=True, blank=True)
    location = models.CharField(max_length=255, null=True, blank=True)
    author = models.ForeignKey(User, on_delete=models.CASCADE)
    category = models.ForeignKey(Category, null=True, blank=True, on_delete=models.SET_NULL)

    def __str__(self):
        return self.title


class EventPhoto(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    event = models.ForeignKey(Event, on_delete=models.CASCADE)
    name = models.CharField(max_length=255, null=True, blank=True)
    image = models.ImageField(upload_to='event_photos/')
    created_at = models.DateTimeField(auto_now_add=True)
    is_main = models.BooleanField(default=False)

    def __str__(self):
        return self.name or str(self.id)


class EventParticipant(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    event = models.ForeignKey(Event, on_delete=models.CASCADE)
    is_staff = models.BooleanField(default=False)


class UserRole(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    role_type = models.CharField(max_length=255)


class UserFriend(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='friend_owner')
    friend = models.ForeignKey(User, on_delete=models.CASCADE, related_name='friends')


class Memory(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    event = models.ForeignKey(Event, null=True, blank=True, on_delete=models.SET_NULL)
    grade = models.IntegerField(null=True, blank=True)
    text = models.TextField(null=True, blank=True)
    is_private = models.BooleanField(default=True)


class MemoryMention(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    memory = models.ForeignKey(Memory, null=True, blank=True, on_delete=models.SET_NULL)
    user = models.ForeignKey(User, null=True, blank=True, on_delete=models.SET_NULL)
    picture = models.IntegerField(null=True, blank=True)
    username = models.CharField(max_length=255, null=True, blank=True)