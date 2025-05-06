import random
import string
from django.contrib.auth import get_user_model
from rest_framework import serializers
from django.core.mail import send_mail

from users.models import *

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
        fields = [
            'title', 'description', 'date', 'city', 'address',
            'author', 'category', 'photos', 'is_free', 'price',
            'contact_email', 'contact_phone'
        ]

    def create(self, validated_data):
        photos = validated_data.pop("photos", [])
        event = Event.objects.create(**validated_data)
        for photo in photos:
            EventPhoto.objects.create(event=event, image=photo)
        return event


class EventAnnouncementSerializer(serializers.ModelSerializer):
    class Meta:
        model = EventAnnouncement
        fields = ['id', 'title', 'message', 'created_at']


class EventPhotoSerializer(serializers.ModelSerializer):
    class Meta:
        model = EventPhoto
        fields = ['id', 'image']


class EventSerializer(serializers.ModelSerializer):
    author = serializers.PrimaryKeyRelatedField(queryset=CustomUser.objects.all())
    category = serializers.CharField(source='category.name', default=None, allow_null=True)
    photos = EventPhotoSerializer(many=True, read_only=True)
    announcements = EventAnnouncementSerializer(many=True, read_only=True)
    city = serializers.CharField(source='city.name')

    class Meta:
        model = Event
        fields = ['id', 'title', 'description', 'date', 'city', 'address', 'author', 'category', 'photos', 'announcements', 'price']


class InterestSerializer(serializers.ModelSerializer):
    class Meta:
        model = Interest
        fields = ['id', 'name', 'code']


class CustomUserSerializer(serializers.ModelSerializer):
    interests = InterestSerializer(many=True)  

    class Meta:
        model = CustomUser
        fields = ['id', 'username', 'first_name', 'last_name', 'bio', 'email', 'city', 'profile_image', 'interests']


class EventParticipantSerializer(serializers.ModelSerializer):
    user = CustomUserSerializer(read_only=True)

    class Meta:
        model = EventParticipant
        fields = ['id', 'user', 'is_staff']


class UserSettingsSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserSettings
        fields = '__all__'
        read_only_fields = ['user']


class UserWithSettingsSerializer(serializers.ModelSerializer):
    settings = UserSettingsSerializer()
    interests = serializers.SerializerMethodField()

    class Meta:
        model = CustomUser
        fields = [
            'first_name', 'last_name', 'bio', 'email', 'phone', 'city', 'address',
            'link_telegram', 'link_instagram', 'link_whatsapp', 'profile_image',
            'settings', 'interests', 'gender', 'birthday'
        ]

    def get_interests(self, obj):
        return [interest.name for interest in obj.interests.all()]

    def update(self, instance, validated_data):
        settings_data = validated_data.pop('settings', {})
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()

        user_settings = instance.settings
        for attr, value in settings_data.items():
            setattr(user_settings, attr, value)
        user_settings.save()

        return instance

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


class NotificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Notification
        fields = '__all__'


class CustomUserUpdateSerializer(serializers.ModelSerializer):
    interests = serializers.ListField(
        child=serializers.CharField(), required=False
    )

    class Meta:
        model = CustomUser
        fields = ['first_name', 'last_name', 'bio', 'gender', 'city', 'email', 'phone', 'birthday', 'interests']

    def update(self, instance, validated_data):
        interests_data = validated_data.pop('interests', [])

        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()

        if interests_data:
            interest_objs = []
            for name in interests_data:
                interest_obj, created = Interest.objects.get_or_create(name__iexact=name.strip(), defaults={'name': name.strip()})
                interest_objs.append(interest_obj)
            instance.interests.set(interest_objs)

        return instance

class CategoryNameListSerializer(serializers.ListSerializer):
    child = serializers.CharField(max_length=255)

class CitySerializer(serializers.ModelSerializer):
    class Meta:
        model = City
        fields = ['id', 'name']

class CityNameListSerializer(serializers.ListSerializer):
    child = serializers.CharField(max_length=255)

class InterestNameListSerializer(serializers.ListSerializer):
    child = serializers.CharField(max_length=255)


class FriendRequestSerializer(serializers.ModelSerializer):
    from_username = serializers.CharField(source='from_user.username', read_only=True)
    to_username = serializers.CharField(source='to_user.username', read_only=True)

    class Meta:
        model = FriendRequest
        fields = ['id', 'from_user', 'from_username', 'to_user', 'to_username', 'created_at']


class FavoriteEventSerializer(serializers.ModelSerializer):
    event = EventSerializer(read_only=True)

    class Meta:
        model = FavoriteEvent
        fields = ['id', 'event', 'created_at']