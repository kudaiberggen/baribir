# Generated by Django 4.2.20 on 2025-05-07 22:28

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0025_usersettings_friend_request'),
    ]

    operations = [
        migrations.AlterField(
            model_name='notification',
            name='friend_request',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, to='users.friendrequest'),
        ),
    ]
