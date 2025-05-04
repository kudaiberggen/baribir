from django.contrib import admin

from users.models import *

# Register your models here.
admin.site.register(Event)
admin.site.register(CustomUser)
admin.site.register(EventParticipant)
admin.site.register(Category)
admin.site.register(Interest)
admin.site.register(EventPhoto)
admin.site.register(UserRole)
admin.site.register(UserSettings)
admin.site.register(UserFriend)
admin.site.register(FriendRequest)
admin.site.register(City)