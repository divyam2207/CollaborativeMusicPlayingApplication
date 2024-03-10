from django.db import models
import random
import string

#function to generate random upper-case string code of digits 6

def generate_random_room_code():
    len = 6

    while True:
        code = ''.join(random.choices(string.ascii_uppercase, k=len))
        #checking if the code already exisits in the model/db table
        if Room.objects.filter(code=code).count() == 0:
            break
    return code

# Create your models here.
class Room(models.Model):
    host = models.CharField(max_length=50, unique=True)
    code = models.CharField(max_length=8, unique=True, default=generate_random_room_code)
    guests_can_pause = models.BooleanField(default=False, null=False)
    votes_to_skip = models.IntegerField(default=1, null=False)
    created_at = models.DateTimeField(auto_now_add=True)
    current_song = models.CharField(null=True,max_length=50)