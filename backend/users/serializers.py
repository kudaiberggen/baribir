import random
import string
from django.contrib.auth import get_user_model
from rest_framework import serializers
from django.core.mail import send_mail

from users.models import Event, EventParticipant, Category, EventPhoto, CustomUser, UserSettings, Interest

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
    

class UserInfoSerializer(serializers.ModelSerializer):
    profile_image = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ("id", "username", "first_name", "last_name", "email", "phone", "profile_image")

    def get_profile_image(self, obj):
        request = self.context.get("request")
        if obj.profile_image and hasattr(obj.profile_image, "url"):
            return request.build_absolute_uri(obj.profile_image.url)
        return None



class EventCreateSerializer(serializers.ModelSerializer):
    photos = serializers.ListField(
        child=serializers.ImageField(), 
        write_only=True,
        required=False
    )

    class Meta:
        model = Event
        fields = ['title', 'description', 'date', 'city', 'address', 'author', 'category', 'photos']

    def create(self, validated_data):
        photos = validated_data.pop("photos", [])
        event = Event.objects.create(**validated_data)

        for photo in photos:
            EventPhoto.objects.create(event=event, image=photo)

        return event

class EventSerializer(serializers.ModelSerializer):
    author = serializers.PrimaryKeyRelatedField(queryset=CustomUser.objects.all())
    category = serializers.PrimaryKeyRelatedField(queryset=Category.objects.all(), required=False, allow_null=True)
    photos = serializers.SerializerMethodField()

    class Meta:
        model = Event
        fields = ['id', 'title', 'description', 'date', 'city', 'address', 'author', 'category', 'photos']

    def get_photos(self, obj):
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


class UserSettingsSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserSettings
        fields = '__all__'
        read_only_fields = ['user']

class CategorySerializer(serializers.ModelSerializer):
    children = serializers.SerializerMethodField()

    class Meta:
        model = Category
        fields = ['id', 'name', 'code', 'parent', 'children']

    def get_children(self, obj):
        children = obj.children.all()
        return CategorySerializer(children, many=True).data if children else []


class InterestSerializer(serializers.ModelSerializer):
    sub_interests = serializers.SerializerMethodField()

    class Meta:
        model = Interest
        fields = ['id', 'name', 'code', 'category', 'parent', 'sub_interests']

    def get_sub_interests(self, obj):
        sub_interests = obj.sub_interests.all()
        return InterestSerializer(sub_interests, many=True).data if sub_interests else []