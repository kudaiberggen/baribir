from django.contrib.auth.models import AbstractUser
from django.db import models
from django.conf import settings
from django.core.validators import MinValueValidator, MaxValueValidator

import uuid

class CustomUser(AbstractUser):
    username = models.CharField(unique=True, max_length=255)
    phone = models.CharField(max_length=15, unique=True, blank=False, null=False)
    email = models.EmailField(unique=True, blank=False, null=False)
    first_name = models.CharField(max_length=150, blank=False, null=False)
    last_name = models.CharField(max_length=150, blank=False, null=False)
    link_telegram = models.CharField(max_length=255, null=True, blank=True)
    link_instagram = models.CharField(max_length=255, null=True, blank=True)
    link_whatsapp = models.CharField(max_length=255, null=True, blank=True)
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

class UserPhoto(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
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
    author = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
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
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    event = models.ForeignKey(Event, on_delete=models.CASCADE)
    is_staff = models.BooleanField(default=False)


class UserRole(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    role_type = models.CharField(max_length=255)


class UserFriend(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='friend_owner')
    friend = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='friends')


class Memory(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='created_memories')  # Автор воспоминания
    event = models.ForeignKey(Event, null=True, blank=True, on_delete=models.SET_NULL)
    grade = models.IntegerField(null=True, blank=True)
    text = models.TextField(null=True, blank=True)
    is_private = models.BooleanField(default=True)

    def __str__(self):
        return f"Memory {self.id} - {self.user}"

class MemoryMention(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    memory = models.ForeignKey(Memory, on_delete=models.CASCADE, related_name='mentions')  # Связь с воспоминанием
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='mentioned_in_memories')  # Упомянутый пользователь
    picture = models.IntegerField(null=True, blank=True)
    username = models.CharField(max_length=255, null=True, blank=True)

    def __str__(self):
        return f"Mention of {self.user} in Memory {self.memory.id}"

class Interest(models.Model):
    id = models.BigAutoField(primary_key=True)
    parent = models.ForeignKey(
        'self',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='sub_interests'
    )
    name = models.CharField(max_length=255)
    code = models.CharField(max_length=255, null=True, blank=True)
    category = models.ForeignKey(
        Category,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='interests'
    )

    def __str__(self):
        return self.name


class Review(models.Model):
    id = models.BigAutoField(primary_key=True)
    created_date = models.DateTimeField(null=True, blank=True)
    likes = models.BigIntegerField(null=True, blank=True)
    rate = models.PositiveSmallIntegerField(
        help_text="1-10",
        validators=[
            MinValueValidator(1),
            MaxValueValidator(10)
        ]
    )
    author = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='reviews'
    )

    class Meta:
        db_table = 'reviews'

    def __str__(self):
        return f"Review by {self.author} - {self.rate}/10"