from django.shortcuts import render
from rest_framework import generics, status
from .models import Room
from .serializers import RoomSerializer, CreateRoomSerializer, UpdateRoomSerializer
from rest_framework.views import APIView
from rest_framework.response import Response
from django.http import JsonResponse
# Create your views here.

class RoomView(generics.ListAPIView):
    queryset = Room.objects.all()
    serializer_class = RoomSerializer

class JoinRoom(APIView):
    lookup_url_kwarg = 'code'
    def post(self, request, format=None):
        if not self.request.session.exists(self.request.session.session_key):
            self.request.session.create()
        code = request.data.get(self.lookup_url_kwarg)
        if code != None:
            room_result = Room.objects.filter(code=code)
            if len(room_result)>0:
                room=room_result[0]
                self.request.session['room_code'] = code
                return Response({'message': 'Room Joined!'}, status=status.HTTP_200_OK)
            
            return Response({'Bad Request': 'Invalid Room Code'}, status=status.HTTP_400_BAD_REQUEST)
        
        return Response({'Bad Request': 'Invalid request, did not find the room you are looking for!'}, status=status.HTTP_400_BAD_REQUEST)

class CreateRoomView(APIView):
    serializer_class = CreateRoomSerializer

    def post(self, request, format=None):
        if not self.request.session.exists(self.request.session.session_key):
            self.request.session.create()
        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            host = self.request.session.session_key
            guests_can_pause = serializer.data.get('guests_can_pause')
            votes_to_skip = serializer.data.get('votes_to_skip')
            queryset = Room.objects.filter(host=host)
            if queryset.exists():
                room = queryset[0]
                room.guests_can_pause = guests_can_pause
                room.votes_to_skip = votes_to_skip
                room.save(update_fields=['guests_can_pause', 'votes_to_skip'])
                self.request.session['room_code'] = room.code
                return Response(RoomSerializer(room).data, status=status.HTTP_202_ACCEPTED)

            else:
                room = Room(host=host, guests_can_pause=guests_can_pause, votes_to_skip=votes_to_skip)
                room.save()
                self.request.session['room_code'] = room.code
                return Response(RoomSerializer(room).data, status=status.HTTP_202_ACCEPTED)
        return Response({'Bad Request': 'Invalid data...'}, status=status.HTTP_400_BAD_REQUEST)

class GetRoom(APIView):
    serializer_class = Room.objects.all()
    lookup_url_kwag = 'code'

    def get(self, request, format=None):
        code = request.GET.get(self.lookup_url_kwag)
        if code != None:
            room = Room.objects.filter(code=code)
            if room and len(room)>0:
                data = RoomSerializer(room[0]).data
                data['is_host'] = request.session.session_key == room[0].host
                return Response(data, status=status.HTTP_200_OK)
            return Response({"Room not found : Invalid Room Code."}, status=status.HTTP_404_NOT_FOUND)
        return Response({'Bad request : Code Param not found in request'}, status=status.HTTP_400_BAD_REQUEST)

class UserInRoom(APIView):
    def get(self, request, format=None):
        if not self.request.session.exists(self.request.session.session_key):
            self.request.session.create()
        data = {
            'code': self.request.session.get('room_code'), 
        }

        return JsonResponse(data, status=status.HTTP_200_OK)

class LeaveRoom(APIView):
    def post(self, request, format=None):
        if 'room_code' in self.request.session:
            self.request.session.pop('room_code')
            host_id = self.request.session.session_key
            room_result = Room.objects.filter(host=host_id)
            if room_result:
                room=room_result[0]
                room.delete()
        return Response({'Message': 'Success'}, status=status.HTTP_200_OK)

class UpdateRoom(APIView):
    serializer_class = UpdateRoomSerializer
    def patch(self, request, format=None):
        if not self.request.session.exists(self.request.session.session_key):
            self.request.session.create()
        serializer=self.serializer_class(data=request.data)
        if serializer.is_valid():
            guests_can_pause = serializer.data.get('guests_can_pause')
            votes_to_skip = serializer.data.get('votes_to_skip')
            code = serializer.data.get('code')

            queryset = Room.objects.filter(code=code)
            if not queryset.exists():
                return Response({'Message': 'Room not found'}, status=status.HTTP_404_NOT_FOUND)
            room=queryset[0]
            user_id = self.request.session.session_key
            if room.host !=user_id:
                return Response({'Message': 'Only hosts can edit the rooms'}, status=status.HTTP_403_FORBIDDEN)
            room.guests_can_pause = guests_can_pause
            room.votes_to_skip = votes_to_skip
            room.save(update_fields=['guests_can_pause', 'votes_to_skip'])
            return Response(RoomSerializer(room).data, status=status.HTTP_200_OK)
        return Response({'Bad Request': 'Invalid request'}, status=status.HTTP_400_BAD_REQUEST)
