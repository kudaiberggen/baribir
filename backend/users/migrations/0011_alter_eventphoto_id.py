# Generated by Django 4.2.20 on 2025-04-17 08:31

from django.db import migrations, models
import uuid


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0010_remove_eventphoto_created_at_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='eventphoto',
            name='id',
            field=models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False),
        ),
    ]
