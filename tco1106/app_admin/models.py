from django.db import models
from django.contrib.auth.models import User
# Create your models here.

class PermissionAdmin(models.Model):
    user = models.ForeignKey(User)
    tco_right_read  = models.BooleanField(blank=True,default=False)
    tco_right_write  = models.BooleanField(blank=True)
    
    param_right_read  = models.BooleanField(blank=True)
    param_right_write  = models.BooleanField(blank=True)
    
    profil_right_read  = models.BooleanField(blank=True)
    profil_right_write  = models.BooleanField(blank=True)
    
    scenario_right_read  = models.BooleanField(blank=True)
    scenario_right_write  = models.BooleanField(blank=True)
    
    mesure_right_read  = models.BooleanField(blank=True)
    mesure_right_write  = models.BooleanField(blank=True)
    
    rapport_right_read  = models.BooleanField(blank=True)
    
    is_expert = models.BooleanField(blank=True)
    
    