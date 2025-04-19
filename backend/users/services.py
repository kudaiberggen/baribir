from django.db.models import Count, Q
from itertools import chain
from users.models import CustomUser, UserFriend

def get_friend_recommendations(user: CustomUser):
    friend_ids = UserFriend.objects.filter(user=user).values_list('friend_id', flat=True)

    common_friends = (
        CustomUser.objects
        .exclude(id__in=friend_ids)
        .exclude(id=user.id)
        .exclude(is_superuser=True)
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
        .filter(city=user.city)
    )

    combined = list(chain(common_friends, same_city))[:20]

    return combined