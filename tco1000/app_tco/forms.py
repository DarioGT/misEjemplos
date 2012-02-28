from django import forms
from django.forms import ModelForm, Textarea, TextInput
from models import  *
from views import *
#from django.core.management.validation import max_length

# Create your models here.


#
#  Formulaire affichant les donnees d'un TCO
#
class TcoForm(ModelForm):
     class Meta:
         model = Tco
         exclude = ()
         widgets = {
            'titre' : TextInput(attrs={'size':40}),
            'description': Textarea(attrs={'cols': 40, 'rows': 3}),
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
#  Formulaire affichant les donnees d'un TCO
#
class TcoFormMoveUnder(forms.Form):
     tco_id         = forms.IntegerField(widget=forms.HiddenInput)
     parent_tco_id  = forms.IntegerField()
     
     def clean_parent_tco_id(self):
        #raise forms.ValidationError("erreur!")
        data = self.cleaned_data['parent_tco_id']
        if data != -1:
            try:
                tco = Tco.objects.get(pk=data)
            except Tco.DoesNotExist:
                raise forms.ValidationError("N'existe pas")
        
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
class ParametreForm(ModelForm):
     class Meta:
         model = Parametre
         exclude = ('tco','parametreType')
         widgets = {
            'documentation': Textarea(attrs={'cols': 30, 'rows': 20}),
         }

