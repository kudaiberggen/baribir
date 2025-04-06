from datetime import timedelta

from django.db.models import Q, Count
from django.shortcuts import get_object_or_404
from django.utils import timezone
from rest_framework.views import APIView
from django.contrib.auth import authenticate
from rest_framework import status, views, generics, permissions
from rest_framework.response import Response
from django.contrib.auth import get_user_model

from .models import Category, Event, EventParticipant
from .serializers import RegisterSerializer, LoginSerializer, PasswordResetSerializer, EventSerializer, \
    EventParticipantSerializer
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

class EventCreateView(generics.CreateAPIView):
    queryset = Event.objects.all()
    serializer_class = EventSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(author=self.request.user)

class EventDetailView(generics.RetrieveAPIView):
    queryset = Event.objects.all()
    serializer_class = EventSerializer
    lookup_field = 'id'

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