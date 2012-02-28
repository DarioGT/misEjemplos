from django.db import models

# Create your models here.

class Contact(models.Model):
    email = models.CharField(max_length=255, blank = True, null = True )
    name = models.CharField(max_length=255, blank = True, null = True )
    phone = models.CharField(max_length=255, blank = True, null = True )