import calendar
from datetime import timedelta, date
from django.conf import settings
from django.db.models import Q, Count
from django.shortcuts import get_object_or_404
from django.utils import timezone
from rest_framework.generics import ListAPIView
from rest_framework.views import APIView
from django.contrib.auth import authenticate
from rest_framework import status, views, generics, permissions, viewsets
from rest_framework.decorators import api_view, permission_classes, action
from rest_framework.response import Response
from django.contrib.auth import get_user_model
from rest_framework.permissions import IsAuthenticated
from rest_framework.parsers import MultiPartParser, FormParser
from .models import Category, Event, EventParticipant, UserSettings, Interest, Notification, CustomUser, UserFriend, \
    City, FriendRequest, FavoriteEvent
from django.core.files.storage import default_storage
from .serializers import *
from rest_framework.exceptions import ValidationError
from rest_framework_simplejwt.tokens import RefreshToken

from .services import *

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
    
class ChangePasswordView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        user = request.user
        current_password = request.data.get("current_password")
        new_password = request.data.get("new_password")
        confirm_password = request.data.get("confirm_password")

        if not user.check_password(current_password):
            return Response({"error": "Incorrect current password"}, status=status.HTTP_400_BAD_REQUEST)

        if new_password != confirm_password:
            return Response({"error": "Passwords do not match"}, status=status.HTTP_400_BAD_REQUEST)

        user.set_password(new_password)
        user.save()
        return Response({"success": "Password updated successfully"}, status=status.HTTP_200_OK)
    
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def deactivate_account(request):
    user = request.user
    user.is_active = False
    user.save()
    return Response({"success": "Account deactivated."}, status=status.HTTP_200_OK)
    
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
            if user.profile_image.name != "profile_images/default.png":
                if default_storage.exists(user.profile_image.name):
                    default_storage.delete(user.profile_image.name)

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

            user.profile_image = "profile_images/default.png"
            user.save()

            return Response({"message": "Profile image reset to default."}, status=status.HTTP_200_OK)

        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class EventFilterView(APIView):
    def get(self, request):
        date = request.GET.get('date')
        category_code = request.GET.get('category')
        interest_codes = request.GET.getlist('interests')
        city_names = request.GET.getlist('city')

        print(category_code, interest_codes, city_names)

        filters = Q()

        # 🔹 Фильтрация по дате
        if date:
            filters &= Q(date__date=date)

        # 🔹 Фильтрация по категории (включая подкатегории)
        if category_code:
            try:
                parent_category = Category.objects.get(code=category_code)
                categories = Category.objects.filter(Q(parent=parent_category) | Q(id=parent_category.id))
                filters &= Q(category__in=categories)
            except Category.DoesNotExist:
                return Response({'error': 'Category not found'}, status=status.HTTP_404_NOT_FOUND)

        if interest_codes:
            filters &= Q(interests__code__in=interest_codes)

        # if not city_names:
        #     if request.user.is_authenticated and request.user.city:
        #         print(request.user.is_authenticated, request.user.city)
        #         city_names = [request.user.city]

        if city_names:
            filters &= Q(city__name__in=city_names)

        events = Event.objects.filter(filters).distinct()
        serializer = EventSerializer(events, many=True)
        return Response(serializer.data)


class GetOtherEventsView(generics.ListAPIView):
    serializer_class = EventSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        event_id = self.kwargs.get("event_id")
        user = self.request.user

        try:
            current_event = Event.objects.get(id=event_id)
        except Event.DoesNotExist:
            return Event.objects.none()

        queryset = Event.objects.exclude(id=event_id)

        # if current_event.category:
        #     queryset = queryset.filter(category=current_event.category)
        # if current_event.city:
        #     queryset = queryset.filter(city=current_event.city)

        # Исключаем ивенты, созданные текущим пользователем
        queryset = queryset.exclude(author=user)

        queryset = queryset.filter(date__gte=timezone.now())

        if user.is_authenticated:
            registered_event_ids = EventParticipant.objects.filter(user=user).values_list('event_id', flat=True)
            queryset = queryset.exclude(id__in=registered_event_ids)

        return queryset.order_by('date')[:10]


class EventDetailView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, event_id):
        try:
            event = Event.objects.get(id=event_id)
        except Event.DoesNotExist:
            return Response({"error": "Event not found"}, status=status.HTTP_404_NOT_FOUND)

        serializer = EventSerializer(event, context={"request": request})
        return Response(serializer.data, status=status.HTTP_200_OK)


class DeleteEventView(APIView):
    permission_classes = [IsAuthenticated]

    def delete(self, request, event_id):
        event = get_object_or_404(Event, id=event_id)

        if event.author != request.user:
            return Response({"detail": "You do not have permission to delete this event."},
                            status=status.HTTP_403_FORBIDDEN)

        event.delete()
        return Response({"detail": "Event deleted successfully."}, status=status.HTTP_204_NO_CONTENT)


class AttendedEventsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        now = timezone.now()

        participated_event_ids = EventParticipant.objects.filter(user=user).values_list('event_id', flat=True)
        past_events = Event.objects.filter(id__in=participated_event_ids, date__lt=now)

        serializer = EventSerializer(past_events, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


class MyCreatedEventsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        events = Event.objects.filter(author=user)
        serializer = EventSerializer(events, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


class UserCreatedEventsView(APIView):
    def get(self, request, user_id):
        user = get_object_or_404(CustomUser, id=user_id)
        events = Event.objects.filter(author=user)
        serializer = EventSerializer(events, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


class EventParticipantsByEventView(APIView):
    def get(self, request, event_id):
        event = get_object_or_404(Event, id=event_id)
        participants = EventParticipant.objects.filter(event=event)
        serializer = EventParticipantSerializer(participants, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

class EventCreateView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        data = request.data.copy()
        data['author'] = request.user.id  # автоматически вставляем автора

        serializer = EventCreateSerializer(data=data, context={'request': request})
        if serializer.is_valid():
            event = serializer.save()
            return Response({"message": "Event created", "event_id": event.id}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class SubscribeToEventView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, event_id, *args, **kwargs):

        try:
            event = Event.objects.get(id=event_id)
        except Event.DoesNotExist:
            return Response({"error": "Event not found."}, status=status.HTTP_404_NOT_FOUND)

        if EventParticipant.objects.filter(user=request.user, event=event).exists():
            return Response({"message": "Already subscribed to this event."}, status=status.HTTP_200_OK)

        EventParticipant.objects.create(user=request.user, event=event)
        return Response({"message": "Successfully subscribed to the event."}, status=status.HTTP_201_CREATED)


class UnsubscribeFromEventView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, event_id, *args, **kwargs):
        try:
            event = Event.objects.get(id=event_id)
        except Event.DoesNotExist:
            return Response({"error": "Event not found."}, status=status.HTTP_404_NOT_FOUND)

        participant = EventParticipant.objects.filter(user=request.user, event=event).first()
        if not participant:
            return Response({"message": "You are not subscribed to this event."}, status=status.HTTP_200_OK)

        participant.delete()
        return Response({"message": "Successfully unsubscribed from the event."}, status=status.HTTP_200_OK)


class EventCalendarView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        today = date.today()
        year, month = today.year, today.month
        days_in_month = calendar.monthrange(year, month)[1]
        start = date(year, month, 1)
        end = date(year, month, days_in_month)

        events = (
            Event.objects
            .filter(start_date__date__range=(start, end))
            .values('start_date__date')
            .annotate(count=Count('id'))
        )
        events_by_date = {e['start_date__date']: e['count'] for e in events}

        result = []
        for i in range(days_in_month):
            current_date = start + timedelta(days=i)
            count = events_by_date.get(current_date, "")
            result.append({
                "date": current_date,
                "day": calendar.day_abbr[current_date.weekday()],
                "count": count
            })

        return Response(result)


class AllEventsView(ListAPIView):
    queryset = Event.objects.all()
    serializer_class = EventSerializer


class EventViewSet(viewsets.ModelViewSet):
    queryset = Event.objects.all()
    serializer_class = EventSerializer

    @action(detail=True, methods=['post'], permission_classes=[IsAuthenticated])
    def recommend(self, request, pk=None):
        event = get_object_or_404(Event, id=pk)
        friends = UserFriend.objects.filter(user=request.user)

        for friend_link in friends:
            friend = friend_link.friend
            create_notification(
                user=friend,
                notif_type="friend_shared_event",
                title="Your friend recommends an event",
                message=f"{request.user.username} recommends you to join '{event.title}'."
            )

        return Response({"status": "Event recommended to friends."})

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


class AddFavoriteEventView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, event_id):
        try:
            event = Event.objects.get(id=event_id)
        except Event.DoesNotExist:
            return Response({'error': 'Event not found'}, status=status.HTTP_404_NOT_FOUND)

        favorite, created = FavoriteEvent.objects.get_or_create(user=request.user, event=event)
        if not created:
            return Response({'message': 'Event already in favorites'}, status=status.HTTP_200_OK)

        return Response({'message': 'Event added to favorites'}, status=status.HTTP_201_CREATED)

class RemoveFavoriteEventView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def delete(self, request, event_id):
        try:
            event = Event.objects.get(id=event_id)
        except Event.DoesNotExist:
            return Response({'error': 'Event not found'}, status=status.HTTP_404_NOT_FOUND)

        try:
            favorite = FavoriteEvent.objects.get(user=request.user, event=event)
            favorite.delete()
            return Response({'message': 'Event removed from favorites'}, status=status.HTTP_204_NO_CONTENT)
        except FavoriteEvent.DoesNotExist:
            return Response({'error': 'Event was not in favorites'}, status=status.HTTP_400_BAD_REQUEST)


class ListFavoriteEventsView(generics.ListAPIView):
    serializer_class = FavoriteEventSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return FavoriteEvent.objects.filter(user=self.request.user).select_related('event')


class UserSettingsView(generics.RetrieveUpdateAPIView):
    serializer_class = UserSettingsSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        settings, created = UserSettings.objects.get_or_create(user=self.request.user)
        return settings


class UserSettingsUpdateView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        serializer = UserWithSettingsSerializer(request.user)
        return Response(serializer.data)

    def post(self, request):
        serializer = UserWithSettingsSerializer(instance=request.user, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


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


class FriendRecommendationsAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        recommendations = get_friend_recommendations(request.user)
        serializer = CustomUserSerializer(recommendations, many=True)
        return Response(serializer.data)


class InterestRecommendationView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        recommendations = get_recommendations_by_interests(request.user)
        serializer = CustomUserSerializer(recommendations, many=True)
        return Response(serializer.data)


class FriendListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user

        friends = UserFriend.objects.filter(user=user)

        friend_users = [friend.friend for friend in friends]
        serializer = CustomUserSerializer(friend_users, many=True)

        return Response(serializer.data)


class ProfileUpdateView(APIView):
    permission_classes = [IsAuthenticated]

    def patch(self, request):
        serializer = CustomUserUpdateSerializer(
            request.user, data=request.data, partial=True
        )
        if serializer.is_valid():
            serializer.save()
            return Response({"message": "Profile updated successfully."})
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class CityListAPIView(APIView):
    def get(self, request):
        cities = City.objects.all().order_by('name')
        serializer = CitySerializer(cities, many=True)
        return Response(serializer.data)


class CityBulkCreateAPIView(APIView):
    def post(self, request):
        serializer = CityNameListSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        names = serializer.validated_data

        existing_names = set(City.objects.filter(name__in=names).values_list('name', flat=True))
        new_cities = [City(name=name) for name in names if name not in existing_names]

        created = City.objects.bulk_create(new_cities)

        return Response(
            {"created": [{"id": city.id, "name": city.name} for city in created]},
            status=status.HTTP_201_CREATED
        )


class InterestBulkCreateAPIView(APIView):
    def post(self, request):
        serializer = InterestNameListSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        names = serializer.validated_data

        existing_names = set(Interest.objects.filter(name__in=names).values_list('name', flat=True))
        new_interests = [Interest(name=name) for name in names if name not in existing_names]

        created = Interest.objects.bulk_create(new_interests)

        return Response(
            {"created": [{"id": i.id, "name": i.name} for i in created]},
            status=status.HTTP_201_CREATED
        )


class CategoryBulkCreateAPIView(APIView):
    def post(self, request):
        serializer = CategoryNameListSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        names = serializer.validated_data

        existing_names = set(Category.objects.filter(name__in=names).values_list('name', flat=True))
        new_categories = [
            Category(name=name, code=name.lower().replace(" ", "_"))
            for name in names if name not in existing_names
        ]

        created = Category.objects.bulk_create(new_categories)

        return Response(
            {"created": [{"id": cat.id, "name": cat.name, "code": cat.code} for cat in created]},
            status=status.HTTP_201_CREATED
        )


def notify_upcoming_events():
    now = timezone.now()
    in_24h = now + timedelta(hours=24)
    in_2h = now + timedelta(hours=2)

    participants_24h = EventParticipant.objects.filter(event__date__range=(in_24h - timedelta(minutes=1), in_24h + timedelta(minutes=1)))
    for p in participants_24h:
        create_notification(
            user=p.user,
            notif_type="event_tomorrow",
            title="Your event is tomorrow",
            message=f"Reminder: '{p.event.title}' is happening in 24 hours."
        )

    participants_2h = EventParticipant.objects.filter(event__date__range=(in_2h - timedelta(minutes=1), in_2h + timedelta(minutes=1)))
    for p in participants_2h:
        create_notification(
            user=p.user,
            notif_type="event_soon",
            title="Your event starts soon",
            message=f"Reminder: '{p.event.title}' starts in 2 hours."
        )


#  Отправка заявки
class SendFriendRequestView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, user_id):
        to_user = get_object_or_404(CustomUser, id=user_id)

        if FriendRequest.objects.filter(from_user=request.user, to_user=to_user, is_active=True).exists():
            return Response({"detail": "Friend request already sent."}, status=status.HTTP_400_BAD_REQUEST)

        if request.user == to_user:
            return Response({"detail": "Cannot add yourself."}, status=status.HTTP_400_BAD_REQUEST)

        FriendRequest.objects.create(from_user=request.user, to_user=to_user)
        return Response({"detail": "Friend request sent."}, status=status.HTTP_201_CREATED)

#  Принятие заявки
class AcceptFriendRequestView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, request_id):
        friend_request = get_object_or_404(FriendRequest, id=request_id, to_user=request.user, is_active=True)

        # создаём двустороннюю дружбу
        UserFriend.objects.create(user=request.user, friend=friend_request.from_user)
        UserFriend.objects.create(user=friend_request.from_user, friend=request.user)

        friend_request.is_active = False
        friend_request.save()

        return Response({"detail": "Friend request accepted."}, status=status.HTTP_200_OK)

#  Отклонение заявки
class DeclineFriendRequestView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, request_id):
        friend_request = get_object_or_404(FriendRequest, id=request_id, to_user=request.user, is_active=True)

        friend_request.is_active = False
        friend_request.save()

        return Response({"detail": "Friend request declined."}, status=status.HTTP_200_OK)


class FriendRequestListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        incoming = FriendRequest.objects.filter(to_user=request.user, is_active=True)
        outgoing = FriendRequest.objects.filter(from_user=request.user, is_active=True)

        data = {
            "incoming_requests": FriendRequestSerializer(incoming, many=True).data,
            "outgoing_requests": FriendRequestSerializer(outgoing, many=True).data,
        }
        return Response(data, status=200)