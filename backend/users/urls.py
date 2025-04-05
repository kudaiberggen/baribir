from django.urls import path
from .views import RegisterView, LoginView, PasswordResetView, EventFilterView, EventCreateView, EventDetailView

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', LoginView.as_view(), name='login'),
    path('password-reset/', PasswordResetView.as_view(), name='password-reset'),
    path('events/', EventFilterView.as_view(), name='filtered-events'),
    path('events/create/', EventCreateView.as_view(), name='event-create'),
    path('events/<uuid:id>/', EventDetailView.as_view(), name='event-detail'),
]