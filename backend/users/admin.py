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
admin.site.register(Chat)
admin.site.register(MessageMedia)

class MessageMediaInline(admin.TabularInline):
    model = MessageMedia
    extra = 1

@admin.register(Message)
class MessageAdmin(admin.ModelAdmin):
    inlines = [MessageMediaInline]
    list_display = ['id', 'sender', 'chat', 'created_at', 'short_content']
    search_fields = ['content', 'sender__username']
    list_filter = ['created_at', 'chat__chat_type']
    readonly_fields = ['created_at']

    def short_content(self, obj):
        return obj.content[:40] + '...' if len(obj.content) > 40 else obj.content