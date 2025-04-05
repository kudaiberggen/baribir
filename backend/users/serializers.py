import random
import string
from django.contrib.auth import get_user_model
from rest_framework import serializers
from django.core.mail import send_mail

from users.models import Event, EventParticipant, Category, EventPhoto, CustomUser

User = get_user_model()

class RegisterSerializer(serializers.ModelSerializer):
    confirm_password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ["username", "first_name", "last_name", "email", "phone", "password", "confirm_password", "profile_image"]
        extra_kwargs = {
            "password": {"write_only": True},
            "profile_image": {"read_only": True}
        }

    def validate(self, data):
        if data["password"] != data["confirm_password"]:
            raise serializers.ValidationError({"password": "Passwords do not match"})
        return data

    def create(self, validated_data):
        validated_data.pop("confirm_password")  
        user = User.objects.create_user(**validated_data)  
        return user


class LoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField()

class PasswordResetSerializer(serializers.Serializer):
    username = serializers.CharField()

    def send_temporary_password(self):
        username = self.validated_data["username"]
        
        try:
            user = User.objects.get(username=username)
        except User.DoesNotExist:
            raise serializers.ValidationError("Пользователь не найден")

        temp_password = ''.join(random.choices(string.ascii_letters + string.digits, k=8))

        user.set_password(temp_password)
        user.save()

        return {"temporary_password": temp_password}

class EventSerializer(serializers.ModelSerializer):
    author = serializers.PrimaryKeyRelatedField(queryset=CustomUser.objects.all())
    category = serializers.PrimaryKeyRelatedField(queryset=Category.objects.all(), required=False, allow_null=True)
    photos = serializers.SerializerMethodField()

    class Meta:
        model = Event
        fields = ['id', 'title', 'description', 'date', 'location', 'author', 'category', 'photos']

    def get_photos(self, obj):
        # Включаем все фото, связанные с событием
        photos = EventPhoto.objects.filter(event=obj)
        return EventPhotoSerializer(photos, many=True).data

class EventPhotoSerializer(serializers.ModelSerializer):
    event = serializers.PrimaryKeyRelatedField(queryset=Event.objects.all())
    image = serializers.ImageField()

    class Meta:
        model = EventPhoto
        fields = ['id', 'event', 'name', 'image', 'created_at', 'is_main']

class EventParticipantSerializer(serializers.ModelSerializer):
    user = serializers.PrimaryKeyRelatedField(queryset=CustomUser.objects.all())
    event = serializers.PrimaryKeyRelatedField(queryset=Event.objects.all())

    class Meta:
        model = EventParticipant
        fields = ['id', 'user', 'event', 'is_staff']