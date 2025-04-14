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
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    date = models.DateTimeField()
    city = models.CharField(max_length=100, blank=True)
    address = models.CharField(max_length=255, blank=True)
    author = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    category = models.ForeignKey(Category, on_delete=models.SET_NULL, null=True, blank=True)
    is_free = models.BooleanField(default=False)
    price = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    contact_email = models.EmailField(blank=True, null=True)
    contact_phone = models.CharField(max_length=20, blank=True, null=True)


class EventPhoto(models.Model):
    event = models.ForeignKey(Event, on_delete=models.CASCADE)
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
        on_delete=models.SET_NULL,
        null=True,
        related_name='reviews'
    )

    class Meta:
        db_table = 'reviews'

    def __str__(self):
        return f"Review by {self.author} - {self.rate}/10"


class UserSettings(models.Model):
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="settings")

    # Notifications
    remind_registered_events = models.BooleanField(default=True)
    personalized_recommendations = models.BooleanField(default=True)
    platform_news = models.BooleanField(default=True)
    trending_events_in_city = models.BooleanField(default=True)
    interest_based_recommendations = models.BooleanField(default=True)
    birthday_greetings = models.BooleanField(default=True)
    event_changes = models.BooleanField(default=True)
    new_messages = models.BooleanField(default=True)
    upcoming_event_reminders = models.BooleanField(default=True)
    someone_interested_in_event = models.BooleanField(default=True)
    event_time_or_location_changes = models.BooleanField(default=True)
    exclusive_promotions = models.BooleanField(default=True)

    # Privacy
    private_account = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.user.username}'s settings"


class Notification(models.Model):
    NOTIFICATION_TYPES = [
        ("remind_registered_events", "Reminder for Registered Events"),
        ("personalized_recommendations", "Personalized Recommendations"),
        ("platform_news", "Platform News and Updates"),
        ("trending_events_in_city", "Trending Events in Your City"),
        ("interest_based_recommendations", "Recommendations Based on Your Interests"),
        ("birthday_greetings", "Birthday and Holiday Greetings"),
        ("event_changes", "Notifications about Event Changes"),
        ("new_messages", "New Messages from Organizers or Participants"),
        ("upcoming_event_reminders", "Reminders for Upcoming Events"),
        ("someone_interested_in_event", "Someone is Interested in Your Event"),
        ("event_time_or_location_changes", "Event Date, Time, or Location Changes"),
        ("exclusive_promotions", "Exclusive Deals and Promotions"),
    ]

    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="notifications")
    type = models.CharField(max_length=50, choices=NOTIFICATION_TYPES)
    title = models.CharField(max_length=255)
    message = models.TextField()
    url = models.URLField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    read = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.user.username} - {self.get_type_display()}"

    class Meta:
        ordering = ["-created_at"]