from django.db import models
from tco.app_tco.models import Parametre,Tco
#from django.core.management.validation import max_length
#from django.core.management.validation import max_length

# Create your models here.
#from django.forms import ModelForm

class Profil(models.Model):
    nomProfil = models.CharField(max_length=45)
    description = models.CharField(max_length=1000)
    nombreOccurence = models.IntegerField()
    documentation = models.CharField(max_length=1000,null=True,blank=True)
    
class Scenario(models.Model):
    profil = models.ForeignKey(Profil)
    nom = models.CharField(max_length=45)
    description = models.CharField(max_length=1000)
    #libre_proprietaire = models.BooleanField()
    scenarioType = models.CharField(max_length=10)
    nombreOccurence = models.IntegerField()
    total_tco = models.FloatField(null=True,blank=True)
    documentation = models.CharField(max_length=1000,null=True,blank=True)
    
class Mesure(models.Model):
    tco = models.ForeignKey(Tco)
    scenario = models.ForeignKey(Scenario)
    description = models.CharField(max_length=1000,null=True,blank=True)
    documentation = models.CharField(max_length=1000,null=True,blank=True)
    annee1 = models.FloatField(null=True,blank=True)
    annee2 = models.FloatField(null=True,blank=True)
    annee3 = models.FloatField(null=True,blank=True)
    annee4 = models.FloatField(null=True,blank=True)
    annee5 = models.FloatField(null=True,blank=True)
    annee6 = models.FloatField(null=True,blank=True)
    annee7 = models.FloatField(null=True,blank=True)
    annee8 = models.FloatField(null=True,blank=True)
    annee9 = models.FloatField(null=True,blank=True)
    annee10 = models.FloatField(null=True,blank=True)
    annee11 = models.FloatField(null=True,blank=True)
    annee12 = models.FloatField(null=True,blank=True)
    annee13 = models.FloatField(null=True,blank=True)
    annee14 = models.FloatField(null=True,blank=True)
    annee15 = models.FloatField(null=True,blank=True)
    annee16 = models.FloatField(null=True,blank=True)
    annee17 = models.FloatField(null=True,blank=True)
    annee18 = models.FloatField(null=True,blank=True)
    annee19 = models.FloatField(null=True,blank=True)
    annee20 = models.FloatField(null=True,blank=True)
    total = models.FloatField(null=True,blank=True)