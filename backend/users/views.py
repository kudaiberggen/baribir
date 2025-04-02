from django.contrib.auth import authenticate
from rest_framework import status, views, generics
from rest_framework.response import Response
from django.contrib.auth import get_user_model
from .serializers import RegisterSerializer, LoginSerializer
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
                    },
                    status=status.HTTP_200_OK,
                )
            return Response({"error": "Invalid credentials"}, status=status.HTTP_400_BAD_REQUEST)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)