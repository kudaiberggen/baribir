from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import RegisterView, LoginView, PasswordResetView, EventFilterView, EventCreateView, EventViewSet, UserInfoView, ChangePhotoView, DeletePhotoView

router = DefaultRouter()
router.register(r'events', EventViewSet)

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', LoginView.as_view(), name='login'),
    path('password-reset/', PasswordResetView.as_view(), name='password-reset'),
    path("user-info/", UserInfoView.as_view(), name="user-info"),
    path('change-photo/', ChangePhotoView.as_view(), name='change-photo'),
    path('delete-photo/', DeletePhotoView.as_view(), name='delete-photo'),
    path('events/', EventFilterView.as_view(), name='filtered-events'),
    path('event/create/', EventCreateView.as_view(), name='event-create'),
    path('', include(router.urls)),
]