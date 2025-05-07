from django.db.models import Count, Q
from itertools import chain
from users.models import CustomUser, UserFriend, Notification


def get_friend_recommendations(user: CustomUser):
    friend_ids = UserFriend.objects.filter(user=user).values_list('friend_id', flat=True)

    common_friends = (
        CustomUser.objects
        .exclude(id__in=friend_ids)
        .exclude(id=user.id)
        .exclude(is_superuser=True)
        .exclude(is_active=False)
        .annotate(
            common_count=Count('friends', filter=Q(friends__in=friend_ids))
        )
        .filter(common_count__gt=2)
        .order_by('-common_count')
    )

    common_friends_ids = common_friends.values_list('id', flat=True)

    same_city = (
        CustomUser.objects
        .exclude(id__in=friend_ids)
        .exclude(id__in=common_friends_ids)
        .exclude(id=user.id)
        .exclude(is_superuser=True)
        .exclude(is_active=False)
        .filter(city=user.city)
    )

    combined = list(chain(common_friends, same_city))[:20]

    return combined


def get_recommendations_by_interests(user: CustomUser):
    friend_ids = UserFriend.objects.filter(user=user).values_list('friend_id', flat=True)
    user_interest_ids = user.interests.values_list('id', flat=True)

    users_with_common_interests = (
        CustomUser.objects
        .exclude(id=user.id)
        .exclude(id__in=friend_ids)
        .exclude(is_superuser=True)
        .exclude(is_active=False)
        .annotate(
            common_interests_count=Count(
                'interests',
                filter=Q(interests__in=user_interest_ids),
                distinct=True
            )
        )
        .filter(common_interests_count__gt=0)
        .order_by('-common_interests_count')[:20]
    )

    return users_with_common_interests


def create_notification(user, notif_type, title, message, url=None, event=None, related_user=None, friend_request=None, extra_data=None):
    Notification.objects.create(
        user=user,
        type=notif_type,
        title=title,
        message=message,
        url=url,
        event=event,
        related_user=related_user,
        friend_request=friend_request,
        extra_data=extra_data
    )