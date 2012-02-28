from django.db import models
#from django.core.management.validation import max_length
#from django.core.management.validation import max_length

# Create your models here.
from django.forms import ModelForm

class Tco(models.Model):
    parent_tco_id = models.IntegerField(null=True)
    niveau = models.CharField(max_length=45)
    titre = models.CharField(max_length=45)
    description = models.CharField(max_length=1000)
    documentation = models.CharField(max_length=1000,null=True)
    
class Parametre(models.Model):
    tco = models.ForeignKey(Tco)
    nomHypothese = models.CharField(max_length=45)
    numHypothese = models.IntegerField()
    description = models.CharField(max_length=1000,blank=True)
    #libre_proprietaire = models.BooleanField()
    parametreType = models.CharField(max_length=10)
    annee1 = models.CharField(max_length=255,null=True,blank=True)
    annee2 = models.CharField(max_length=255,null=True,blank=True)
    annee3 = models.CharField(max_length=255,null=True,blank=True)
    annee4 = models.CharField(max_length=255,null=True,blank=True)
    annee5 = models.CharField(max_length=255,null=True,blank=True)
    annee6 = models.CharField(max_length=255,null=True,blank=True)
    annee7 = models.CharField(max_length=255,null=True,blank=True)
    annee8 = models.CharField(max_length=255,null=True,blank=True)
    annee9 = models.CharField(max_length=255,null=True,blank=True)
    annee10 = models.CharField(max_length=255,null=True,blank=True)
    annee11 = models.CharField(max_length=255,null=True,blank=True)
    annee12 = models.CharField(max_length=255,null=True,blank=True)
    annee13 = models.CharField(max_length=255,null=True,blank=True)
    annee14 = models.CharField(max_length=255,null=True,blank=True)
    annee15 = models.CharField(max_length=255,null=True,blank=True)
    annee16 = models.CharField(max_length=255,null=True,blank=True)
    annee17 = models.CharField(max_length=255,null=True,blank=True)
    annee18 = models.CharField(max_length=255,null=True,blank=True)
    annee19 = models.CharField(max_length=255,null=True,blank=True)
    annee20 = models.CharField(max_length=255,null=True,blank=True)
    documentation = models.CharField(max_length=1000,null=True,blank=True)
