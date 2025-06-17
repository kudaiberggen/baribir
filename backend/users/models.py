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
    city = models.CharField(max_length=100, null=True, blank=True)
    address = models.CharField(max_length=255, null=True, blank=True)
    link_telegram = models.CharField(max_length=255, null=True, blank=True)
    link_instagram = models.CharField(max_length=255, null=True, blank=True)
    link_whatsapp = models.CharField(max_length=255, null=True, blank=True)
    birthday = models.DateField(null=True, blank=True)
    gender = models.BooleanField(default=None, null=True, blank=True)
    bio = models.TextField(null=True, blank=True)
    interests = models.ManyToManyField('Interest', related_name='users', blank=True)
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

class Location(models.Model):
    address = models.CharField(max_length=255, blank=True, null=True)
    latitude = models.FloatField()
    longitude = models.FloatField()

    def __str__(self):
        return self.address or f"{self.latitude}, {self.longitude}"


class Event(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    date = models.DateTimeField(null=True, blank=True)
    city = models.ForeignKey('City', on_delete=models.SET_NULL, null=True, blank=True)
    address = models.CharField(max_length=255, null=True, blank=True)
    location = models.OneToOneField(Location, on_delete=models.SET_NULL, null=True, blank=True)
    author = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    category = models.ForeignKey(Category, on_delete=models.SET_NULL, null=True, blank=True)
    is_free = models.BooleanField(default=False)
    is_adult = models.BooleanField(default=False)
    price = models.CharField(max_length=20, blank=True, null=True)
    contact_email = models.EmailField(blank=True, null=True)
    contact_phone = models.CharField(max_length=20, blank=True, null=True)

    def __str__(self):
        return self.title


class EventPhoto(models.Model):
    event = models.ForeignKey(Event, on_delete=models.CASCADE, related_name='photos')
    image = models.ImageField(upload_to="event_photos/")


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


class UserSettings(models.Model):
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="settings")

    # Notifications
    event_joined = models.BooleanField(default=True)
    friend_joined_event = models.BooleanField(default=True)
    friend_recommended_event = models.BooleanField(default=True)
    friend_created_event = models.BooleanField(default=True)
    event_announcement = models.BooleanField(default=True)
    event_reminder_1d = models.BooleanField(default=True)
    event_reminder_2h = models.BooleanField(default=True)
    event_deleted = models.BooleanField(default=True)
    friend_request = models.BooleanField(default=True)
    friend_request_accepted = models.BooleanField(default=True)

    # Email
    email_trending_events = models.BooleanField(default=False)
    email_interest_based = models.BooleanField(default=False)
    email_birthday_greetings = models.BooleanField(default=False)
    email_event_changes = models.BooleanField(default=False)

    # Privacy
    private_account = models.BooleanField(default=False)
    friend_request = models.BooleanField(default=True)

    def __str__(self):
        return f"{self.user.username}'s settings"


class Notification(models.Model):
    NOTIFICATION_TYPES = [
        # Event-related
        ("event_joined", "Someone joined your event"),
        ("friend_joined_event", "Your friend joined an event"),
        ("friend_recommended_event", "Your friend recommended an event"),
        ("friend_created_event", "Your friend created an event"),
        ("event_announcement", "Announcement for Event Participants"),
        ("event_reminder_1d", "Event Reminder: 1 Day Before"),
        ("event_reminder_2h", "Event Reminder: 2 Hours Before"),
        ("event_deleted", "Event Cancelled"),

        # Friendship-related
        ("friend_request", "New Friend Request"),
        ("friend_request_accepted", "Friend Request Accepted"),
    ]

    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="notifications")
    type = models.CharField(max_length=50, choices=NOTIFICATION_TYPES)
    title = models.CharField(max_length=255)
    message = models.TextField()
    url = models.URLField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    read = models.BooleanField(default=False)
    event = models.ForeignKey("Event", on_delete=models.CASCADE, null=True, blank=True, related_name="notifications")
    related_user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True, related_name="related_notifications")
    friend_request = models.ForeignKey("FriendRequest", on_delete=models.SET_NULL, null=True, blank=True)
    extra_data = models.JSONField(null=True, blank=True)

    def __str__(self):
        return f"{self.user.username} - {self.get_type_display()}"

    class Meta:
        ordering = ["-created_at"]


class EventAnnouncement(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    event = models.ForeignKey('Event', on_delete=models.CASCADE, related_name='announcements')
    creator = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='event_announcements')
    title = models.CharField(max_length=255)
    message = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"Announcement for {self.event.title} by {self.creator.username}"

class City(models.Model):
    name = models.CharField(max_length=255)
    country = models.CharField(max_length=100, blank=True, null=True)
    latitude = models.FloatField(blank=True, null=True)
    longitude = models.FloatField(blank=True, null=True)

    def __str__(self):
        return self.name


class FriendRequest(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    from_user = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='sent_friend_requests')
    to_user = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='received_friend_requests')
    created_at = models.DateTimeField(auto_now_add=True)
    is_active = models.BooleanField(default=True)  # заявка активна, пока не принята или не отклонена

    class Meta:
        unique_together = ('from_user', 'to_user')  # чтобы не было повторных заявок


class FavoriteEvent(models.Model):
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='favorite_events')
    event = models.ForeignKey(Event, on_delete=models.CASCADE, related_name='favorited_by')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'event')  # Чтобы не было повторов

    def __str__(self):
        return f'{self.user.username} → {self.event.title}'


class Chat(models.Model):
    EVENT = 'event'
    PRIVATE = 'private'
    GROUP = 'group'

    CHAT_TYPE_CHOICES = [
        (EVENT, 'Event Chat'),
        (PRIVATE, 'Private Chat'),
        (GROUP, 'Group Chat'),
    ]

    chat_type = models.CharField(max_length=10, choices=CHAT_TYPE_CHOICES)
    name = models.CharField(max_length=255, blank=True, null=True)  # для групп/ивентов
    event = models.ForeignKey('Event', on_delete=models.SET_NULL, null=True, blank=True)
    participants = models.ManyToManyField(CustomUser, related_name='chats')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name or f"{self.chat_type} chat #{self.pk}"



class MessageMedia(models.Model):
    IMAGE = 'image'
    VIDEO = 'video'
    FILE = 'file'

    MEDIA_TYPE_CHOICES = [
        (IMAGE, 'Image'),
        (VIDEO, 'Video'),
        (FILE, 'File'),
    ]

    message = models.ForeignKey('Message', on_delete=models.CASCADE, related_name='media')
    file = models.FileField(upload_to='chat_media/')
    media_type = models.CharField(max_length=10, choices=MEDIA_TYPE_CHOICES)
    uploaded_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.media_type} for message {self.message.id}"

class Message(models.Model):
    chat = models.ForeignKey('Chat', on_delete=models.CASCADE, related_name='messages')
    sender = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    content = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['created_at']

    def __str__(self):
        return f"Message from {self.sender} at {self.created_at}"

