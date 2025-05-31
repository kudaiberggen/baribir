from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import *

router = DefaultRouter()
router.register(r'events', EventViewSet)
router.register('chats', ChatViewSet, basename='chat')
router.register('messages', MessageViewSet, basename='message')
router.register('media', MessageMediaViewSet, basename='media')

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', LoginView.as_view(), name='login'),
    path('password-reset/', PasswordResetView.as_view(), name='password-reset'),
    path("change-password/", ChangePasswordView.as_view(), name ='change-password'),
    path("deactivate-account/", deactivate_account, name ='deactivate-account'),
    path("user-info/", UserInfoView.as_view(), name="user-info"),
    path('users/<id>/', UserDetailView.as_view(), name='user-detail'),
    path('change-photo/', ChangePhotoView.as_view(), name='change-photo'),
    path('delete-photo/', DeletePhotoView.as_view(), name='delete-photo'),
    path('events/calendar/', EventCalendarView.as_view(), name='events-calendar'),
    path('events/', EventFilterView.as_view(), name='filtered-events'),
    path('events/popular/', PopularEventsView.as_view(), name='list-favorite-events'),
    path('events/all/', AllEventsView.as_view(), name='all-events'),
    path('events/attended/', AttendedEventsView.as_view(), name='attended-events'),
    path('events/favorites', ListFavoriteEventsView.as_view(), name='list-favorite-events'),
    path('event/<uuid:event_id>/add-to-favorite/', AddFavoriteEventView.as_view(), name='add-favorite-event'),
    path('event/<uuid:event_id>/remove-from-favorite/', RemoveFavoriteEventView.as_view(), name='remove-favorite-event'),
    path('event/<uuid:event_id>/other/', GetOtherEventsView.as_view(), name='remove-favorite-event'),
    path('event/create/', EventCreateView.as_view(), name='event-create'),
    path('event/<uuid:event_id>/subscribe/', SubscribeToEventView.as_view(), name='event-subscribe'),
    path('event/<uuid:event_id>/unsubscribe/', UnsubscribeFromEventView.as_view(), name='event-unsubscribe'),
    path('event/<uuid:event_id>/participants/', EventParticipantsByEventView.as_view(), name='event-participants'),
    path("event/<uuid:event_id>/", EventDetailView.as_view(), name="event-detail"),
    path('event/<uuid:event_id>/delete/', DeleteEventView.as_view(), name='event-delete'),
    path('settings/', UserSettingsView.as_view(), name='user-settings'),
    path('user-with-settings/', UserSettingsUpdateView.as_view(), name='user-settings'),
    path('categories/', GetCategoriesView.as_view(), name='get-categories'),
    path('categories/add-bulk/', CategoryBulkCreateAPIView.as_view(), name='categories-bulk-create'),
    path('interests/', GetInterestsView.as_view(), name='get-interests'),
    path('interests/add-bulk/', InterestBulkCreateAPIView.as_view(), name='interest-bulk-create'),
    path('cities/', CityListAPIView.as_view(), name='get-cities'),
    path('cities/add-bulk/', CityBulkCreateAPIView.as_view(), name='city-bulk-create'),
    path('notifications/', GetNotificationsView.as_view(), name='get-notifications'),
    path('profile/my-events/', MyCreatedEventsView.as_view(), name='my-created-events'),
    path('profile/update/', ProfileUpdateView.as_view(), name='profile-update'),
    path('user/<int:user_id>/created-events/', UserCreatedEventsView.as_view(), name='user-created-events'),
    path('friends/', FriendListView.as_view(), name='friend-list'),
    path('friends/recommendations/', FriendRecommendationsAPIView.as_view(), name='friend-recommendations'),
    path('friends/recommendations/by-interest', InterestRecommendationView.as_view(), name='friends-recommendations/by-interest'),
    path('friend-request/', FriendRequestListView.as_view(), name='friend_request_list'),
    path('friend-request/send/<user_id>/', SendFriendRequestView.as_view(), name='send_friend_request'),
    path('friend-request/accept/<request_id>/', AcceptFriendRequestView.as_view(), name='accept_friend_request'),
    path('friend-request/decline/<request_id>/', DeclineFriendRequestView.as_view(), name='decline_friend_request'),
    path('user/<friend_id>/unfollow/', UnfollowAPIView.as_view(), name='api-unfollow'),
    path('friends/is_friend/<friend_id>/', IsFriendView.as_view(), name='is-friend'),
    path('', include(router.urls)),
]