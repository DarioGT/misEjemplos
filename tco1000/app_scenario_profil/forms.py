from django import forms
from django.forms import ModelForm, Textarea, TextInput
from models import  *
from views import *
#from django.core.management.validation import max_length

# Create your models here.


#
#  Formulaire affichant les donnees d'un TCO
#
class ProfilForm(ModelForm):
     class Meta:
         model = Profil
         exclude = ()
         widgets = {
            'nomProfil' : TextInput(attrs={'size':40}),
            'nombreOccurence' : TextInput(attrs={'size':6}),
            'description': Textarea(attrs={'cols': 40, 'rows': 6}),
            'documentation': Textarea(attrs={'cols': 40, 'rows': 20}),
         }

     #id             = forms.IntegerField(widget=forms.HiddenInput)
     #parent_tco_id  = forms.IntegerField(widget=forms.HiddenInput)
     #niveau         = forms.IntegerField(widget=forms.HiddenInput)
     #titre          = forms.CharField()
     #description    = forms.CharField()
     #documentation    = forms.CharField(widget=forms.Textarea)
     def clean_titre(self):
        data = self.cleaned_data['titre']
        return data



#
#    Formulaire s'occupant de suppriner un element TCO
#
class DeleteForm(forms.Form):
    action = forms.HiddenInput()
    tco_id = forms.IntegerField()
    
#
#  Formulaire affichant les donnees d'un parametre
#    
class ScenarioForm(ModelForm):
     class Meta:
         model = Scenario
         exclude = ('profil','scenarioType')
         widgets = {
            'nom' : TextInput(attrs={'size':40}),
            'nombreOccurence' : TextInput(attrs={'size':5}),
            'description' : Textarea(attrs={'cols': 30, 'rows': 6}),
            'documentation': Textarea(attrs={'cols': 30, 'rows': 20}),
         }
         
         
    
#
#  Formulaire affichant les donnees d'un parametre
#    
class MesureForm(ModelForm):
     class Meta:
         model = Mesure
         exclude = ('scenario','tco')
         widgets = {
            'description' : Textarea(attrs={'cols': 30, 'rows': 6}),
            'documentation': Textarea(attrs={'cols': 30, 'rows': 20}),
         }

