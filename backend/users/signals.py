from django.db.models.signals import post_save, pre_delete, post_delete
from django.dispatch import receiver
from django.conf import settings

from .models import *
from .services import create_notification


@receiver(post_save, sender=settings.AUTH_USER_MODEL)
def create_user_settings(sender, instance, created, **kwargs):
    if created:
        UserSettings.objects.create(user=instance)


@receiver(post_save, sender=EventParticipant)
def notify_author_when_someone_joins(sender, instance, created, **kwargs):
    if created and instance.user != instance.event.author:
        create_notification(
            user=instance.event.author,
            notif_type="subscribed_to_event",
            title="Someone joined your event",
            message=f"{instance.user.username} has joined your event '{instance.event.title}'."
        )


@receiver(post_save, sender=EventParticipant)
def notify_friends_on_join(sender, instance, created, **kwargs):
    if not created:
        return
    user = instance.user
    friends = user.friends.all()  # Используется related_name="friends"
    for f in friends:
        create_notification(
            user=f,
            notif_type="friend_subscribed",
            title="Your friend joined an event",
            message=f"{user.username} joined '{instance.event.title}'."
        )


@receiver(post_save, sender=Event)
def notify_friends_about_new_event(sender, instance, created, **kwargs):
    if created:
        friends = instance.author.friends.all()
        for f in friends:
            create_notification(
                user=f.friend,
                notif_type="friend_event_announcement",
                title="Your friend created an event",
                message=f"{instance.author.username} created a new event: '{instance.title}'."
            )


@receiver(post_save, sender=UserFriend)
def friend_request_sent(sender, instance, created, **kwargs):
    if created:
        create_notification(
            user=instance.friend,
            notif_type="friend_request",
            title="Friend request",
            message=f"{instance.user.username} sent you a friend request."
        )

@receiver(post_save, sender=UserFriend)
def friend_request_accepted(sender, instance, created, **kwargs):
    if not created:
        return
    if UserFriend.objects.filter(user=instance.friend, friend=instance.user).exists():
        create_notification(
            user=instance.user,
            notif_type="friend_request_accepted",
            title="Friend request accepted",
            message=f"{instance.friend.username} accepted your friend request."
        )


@receiver(post_save, sender=EventAnnouncement)
def notify_event_participants(sender, instance, created, **kwargs):
    if created:
        participants = EventParticipant.objects.filter(event=instance.event)
        for p in participants:
            create_notification(
                user=p.user,
                notif_type="event_announcement",
                title=f"Announcement for {instance.event.title}",
                message=instance.message
            )


@receiver(pre_delete, sender=Event)
def notify_participants_event_deleted(sender, instance, **kwargs):
    participants = EventParticipant.objects.filter(event=instance)
    for p in participants:
        create_notification(
            user=p.user,
            notif_type="event_deleted",
            title="Event cancelled",
            message=f"The event '{instance.title}' has been cancelled by the organizer."
        )



@receiver(post_delete, sender=EventPhoto)
def delete_event_photo_file(sender, instance, **kwargs):
    if instance.image:
        instance.image.delete(save=False)