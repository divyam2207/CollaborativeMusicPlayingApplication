from rest_framework import serializers
from .models import Room

class RoomSerializer(serializers.ModelSerializer):
    class Meta:
        model = Room
        fields = ('id', 'host', 'code', 'guests_can_pause', 
                  'votes_to_skip', 'created_at')