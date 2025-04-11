from django.contrib import admin

from users.models import *

# Register your models here.
admin.site.register(Event)
admin.site.register(CustomUser)
admin.site.register(EventParticipant)
admin.site.register(Memory)
admin.site.register(Category)
admin.site.register(MemoryMention)
admin.site.register(Interest)
admin.site.register(EventPhoto)
admin.site.register(UserRole)
admin.site.register(Review)
admin.site.register(UserSettings)