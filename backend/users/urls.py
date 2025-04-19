from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import RegisterView, LoginView, PasswordResetView, EventFilterView, EventCreateView, EventViewSet, \
    UserInfoView, ChangePhotoView, DeletePhotoView, UserSettingsView, GetCategoriesView, GetInterestsView, \
    GetNotificationsView, UserSettingsUpdateView, SubscribeToEventView, EventParticipantsByEventView, \
    AttendedEventsView, ChangePasswordView, deactivate_account, MyCreatedEventsView, UserCreatedEventsView, \
    FriendRecommendationsAPIView, InterestRecommendationView, FriendListView

router = DefaultRouter()
router.register(r'events', EventViewSet)

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', LoginView.as_view(), name='login'),
    path('password-reset/', PasswordResetView.as_view(), name='password-reset'),
    path("change-password/", ChangePasswordView.as_view(), name ='change-password'),
    path("deactivate-account/", deactivate_account, name ='deactivate-account'),
    path("user-info/", UserInfoView.as_view(), name="user-info"),
    path('change-photo/', ChangePhotoView.as_view(), name='change-photo'),
    path('delete-photo/', DeletePhotoView.as_view(), name='delete-photo'),
    path('events/', EventFilterView.as_view(), name='filtered-events'),
    path('events/attended/', AttendedEventsView.as_view(), name='attended-events'),
    path('event/create/', EventCreateView.as_view(), name='event-create'),
    path('event/subscribe/', SubscribeToEventView.as_view(), name='event-subscribe'),
    path('event/<uuid:event_id>/participants/', EventParticipantsByEventView.as_view(), name='event-participants'),
    path('settings/', UserSettingsView.as_view(), name='user-settings'),
    path('user-with-settings/', UserSettingsUpdateView.as_view(), name='user-settings'),
    path('categories/', GetCategoriesView.as_view(), name='get-categories'),
    path('interests/', GetInterestsView.as_view(), name='get-interests'),
    path('notifications/', GetNotificationsView.as_view(), name='get-notifications'),
    path('profile/my-events/', MyCreatedEventsView.as_view(), name='my-created-events'),
    path('user/<int:user_id>/created-events/', UserCreatedEventsView.as_view(), name='user-created-events'),
    path('friends/', FriendListView.as_view(), name='friend-list'),
    path('friends/recommendations/', FriendRecommendationsAPIView.as_view(), name='friend-recommendations'),
    path('friends/recommendations/by-interest', InterestRecommendationView.as_view(), name='friends-recommendations/by-interest'),
    path('', include(router.urls)),
]