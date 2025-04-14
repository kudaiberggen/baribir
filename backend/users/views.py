from datetime import timedelta
from django.conf import settings
from django.db.models import Q, Count
from django.shortcuts import get_object_or_404
from django.utils import timezone
from rest_framework.views import APIView
from django.contrib.auth import authenticate
from rest_framework import status, views, generics, permissions, viewsets
from rest_framework.response import Response
from django.contrib.auth import get_user_model
from rest_framework.permissions import IsAuthenticated
from rest_framework.parsers import MultiPartParser, FormParser
from .models import Category, Event, EventParticipant, UserSettings, Interest, Notification
from django.core.files.storage import default_storage
from .serializers import RegisterSerializer, LoginSerializer, PasswordResetSerializer, EventSerializer, \
    EventParticipantSerializer, EventCreateSerializer, UserInfoSerializer, UserSettingsSerializer, CategorySerializer, \
    InterestSerializer, NotificationSerializer
from rest_framework.exceptions import ValidationError
from rest_framework_simplejwt.tokens import RefreshToken

User = get_user_model()

class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = RegisterSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            try:
                serializer.save()
                return Response({"message": "Account created successfully!"}, status=status.HTTP_201_CREATED)
            except Exception as e:
                raise ValidationError({"error": str(e)})
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class LoginView(views.APIView):
    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        if serializer.is_valid():
            username = serializer.validated_data["username"]
            password = serializer.validated_data["password"]
            user = authenticate(request, username=username, password=password)

            if user is not None:
                refresh = RefreshToken.for_user(user)
                return Response(
                    {
                        "message": "Login successful",
                        "access_token": str(refresh.access_token),
                        "refresh_token": str(refresh),
                        "profile_image": request.build_absolute_uri(user.profile_image.url) if user.profile_image else None
                    },
                    status=status.HTTP_200_OK,
                )
            return Response({"error": "Invalid credentials"}, status=status.HTTP_400_BAD_REQUEST)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
class PasswordResetView(APIView):
    def post(self, request):
        serializer = PasswordResetSerializer(data=request.data)
        if serializer.is_valid():
            response_data = serializer.send_temporary_password()
            return Response(response_data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
class UserInfoView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        serializer = UserInfoSerializer(request.user, context={"request": request})
        return Response(serializer.data)

class ChangePhotoView(APIView):
    def post(self, request):
        user = request.user
        new_image = request.FILES.get("profile_image")

        if not new_image:
            return Response({"error": "No image provided."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            # Удаляем старое изображение, если оно не дефолтное
            if user.profile_image.name != "profile_images/default.png":
                if default_storage.exists(user.profile_image.name):
                    default_storage.delete(user.profile_image.name)

            # Сохраняем новое изображение
            user.profile_image = new_image
            user.save()

            return Response({"message": "Profile image updated successfully."}, status=status.HTTP_200_OK)

        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class DeletePhotoView(APIView):
    def delete(self, request):
        user = request.user

        try:
            if user.profile_image.name != "profile_images/default.png":
                if default_storage.exists(user.profile_image.name):
                    default_storage.delete(user.profile_image.name)

            # Назначаем дефолтную аватарку
            user.profile_image = "profile_images/default.png"
            user.save()

            return Response({"message": "Profile image reset to default."}, status=status.HTTP_200_OK)

        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class EventFilterView(APIView):
    def get(self, request):
        date = request.GET.get('date')
        category_code = request.GET.get('category')
        interests = request.GET.getlist('interests')

        filters = Q()

        if date:
            filters &= Q(date=date)

        if category_code:
            try:
                parent_category = Category.objects.get(code=category_code)
                categories = Category.objects.filter(Q(parent=parent_category) | Q(id=parent_category.id))
                filters &= Q(category__in=categories)
            except Category.DoesNotExist:
                return Response({'error': 'Category not found'}, status=status.HTTP_404_NOT_FOUND)

        if interests:
            filters &= Q(category__name__in=interests)

        events = Event.objects.filter(filters).distinct()
        serializer = EventSerializer(events, many=True)
        return Response(serializer.data)

class EventParticipantsByEventView(APIView):
    def get(self, request, event_id):
        event = get_object_or_404(Event, id=event_id)
        participants = EventParticipant.objects.filter(event=event)
        serializer = EventParticipantSerializer(participants, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

class EventCreateView(APIView):
    def post(self, request, *args, **kwargs):
        serializer = EventCreateSerializer(data=request.data)
        if serializer.is_valid():
            event = serializer.save()
            return Response({"id": str(event.id)}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class EventViewSet(viewsets.ModelViewSet):
    queryset = Event.objects.all()
    serializer_class = EventSerializer

class PopularEventsView(APIView):
    def get(self, request):
        today = timezone.now().date()
        in_30_days = today + timedelta(days=30)

        popular_events = (
            Event.objects
            .filter(date__gte=today, date__lt=in_30_days)
            .annotate(
                participant_count=Count(
                    'eventparticipant',
                    filter=Q(eventparticipant__is_staff=False)
                )
            )
            .order_by('-participant_count')[:10]
        )

        serializer = EventSerializer(popular_events, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)



class UserSettingsView(generics.RetrieveUpdateAPIView):
    serializer_class = UserSettingsSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        settings, created = UserSettings.objects.get_or_create(user=self.request.user)
        return settings


class GetCategoriesView(APIView):
    def get(self, request):
        categories = Category.objects.filter(parent=None)
        serializer = CategorySerializer(categories, many=True)
        return Response(serializer.data)


class GetInterestsView(APIView):
    def get(self, request):
        interests = Interest.objects.filter(parent=None)
        serializer = InterestSerializer(interests, many=True)
        return Response(serializer.data)

class GetNotificationsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        settings = getattr(user, 'settings', None)
        print(settings)
        if not settings:
            return Response([])

        allowed_types = [
            key for key, enabled in vars(settings).items()
            if key in dict(Notification.NOTIFICATION_TYPES) and enabled
        ]

        notifications = Notification.objects.filter(user=user, type__in=allowed_types)
        serializer = NotificationSerializer(notifications, many=True)
        return Response(serializer.data)