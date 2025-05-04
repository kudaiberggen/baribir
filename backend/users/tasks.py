from datetime import timedelta

from django.utils import timezone

from users.models import EventParticipant
from users.services import create_notification


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