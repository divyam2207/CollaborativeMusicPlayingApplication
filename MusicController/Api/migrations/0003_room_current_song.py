# Generated by Django 3.1.7 on 2024-03-10 12:19

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('Api', '0002_auto_20240309_1438'),
    ]

    operations = [
        migrations.AddField(
            model_name='room',
            name='current_song',
            field=models.CharField(max_length=50, null=True),
        ),
    ]