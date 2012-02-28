from django import forms
from django.forms import ModelForm, Textarea,PasswordInput,TextInput
from models import  *
from views import *
from django.contrib.auth.models import User
from django.utils import translation
from django.utils.cache import patch_vary_headers
from django.utils.translation import gettext
from django.utils.translation import ugettext_lazy as _ 

class UserForm(forms.Form):
    __is_mode_edit = False
    
    username = forms.CharField(label=_(u'Username'))
    password  = forms.CharField(label=_(u'Password'),widget=forms.PasswordInput(render_value=False))
    email  = forms.CharField()
    superuser  = forms.CharField(label=_(u'Superuser'),widget=forms.CheckboxInput())
    
    tco_right_read  = forms.CharField(label=_(u'Superuser'),widget=forms.CheckboxInput())
    tco_right_write  = forms.CharField(label=_(u'Superuser'),widget=forms.CheckboxInput())
    
    param_right_read  = forms.CharField(label=_(u'Superuser'),widget=forms.CheckboxInput())
    param_right_write  = forms.CharField(label=_(u'Superuser'),widget=forms.CheckboxInput())
    
    profil_right_read  = forms.CharField(label=_(u'Superuser'),widget=forms.CheckboxInput())
    profil_right_write  = forms.CharField(label=_(u'Superuser'),widget=forms.CheckboxInput())
    
    scenario_right_read  = forms.CharField(label=_(u'Superuser'),widget=forms.CheckboxInput())
    scenario_right_write  = forms.CharField(label=_(u'Superuser'),widget=forms.CheckboxInput())
    
    mesure_right_read  = forms.CharField(label=_(u'Superuser'),widget=forms.CheckboxInput())
    mesure_right_write  = forms.CharField(label=_(u'Superuser'),widget=forms.CheckboxInput())
    
    rapport_right_read  = forms.CharField(label=_(u'Superuser'),widget=forms.CheckboxInput())
    
    def isModeEdit(self,modeEdit = False):
        self.__is_mode_edit = modeEdit
        
    
    def clean_username(self):
        data = self.cleaned_data
        try:
            if not self.__is_mode_edit:
                User.objects.get(username = data['username'])
            else:
                return data['username']
        except User.DoesNotExist:
            return data['username']
        raise forms.ValidationError(_("Nom d'utilisateur utilise."))
    def clean_password(self):
            data = self.cleaned_data
            if not self.__is_mode_edit and len(data['password']) == 0:
                forms.ValidationError(_("Nom d'utilisateur utilise."))
            else:
                return data['password']
            
            
class UserFormEdit(forms.Form):
    __is_mode_edit = False
    
    username = forms.CharField(label=_(u'Username'))
    email  = forms.CharField()
    superuser  = forms.CharField(label=_(u'Superuser'),widget=forms.CheckboxInput())
    
    tco_right_read  = forms.CharField(label=_(u'Superuser'),widget=forms.CheckboxInput())
    tco_right_write  = forms.CharField(label=_(u'Superuser'),widget=forms.CheckboxInput())
    
    param_right_read  = forms.CharField(label=_(u'Superuser'),widget=forms.CheckboxInput())
    param_right_write  = forms.CharField(label=_(u'Superuser'),widget=forms.CheckboxInput())
    
    profil_right_read  = forms.CharField(label=_(u'Superuser'),widget=forms.CheckboxInput())
    profil_right_write  = forms.CharField(label=_(u'Superuser'),widget=forms.CheckboxInput())
    
    scenario_right_read  = forms.CharField(label=_(u'Superuser'),widget=forms.CheckboxInput())
    scenario_right_write  = forms.CharField(label=_(u'Superuser'),widget=forms.CheckboxInput())
    
    mesure_right_read  = forms.CharField(label=_(u'Superuser'),widget=forms.CheckboxInput())
    mesure_right_write  = forms.CharField(label=_(u'Superuser'),widget=forms.CheckboxInput())
    
    rapport_right_read  = forms.CharField(label=_(u'Superuser'),widget=forms.CheckboxInput())
    
    def isModeEdit(self,modeEdit = False):
        self.__is_mode_edit = modeEdit
        
    
    def clean_username(self):
        data = self.cleaned_data
        try:
            if not self.__is_mode_edit:
                User.objects.get(username = data['username'])
            else:
                return data['username']
        except User.DoesNotExist:
            return data['username']
        raise forms.ValidationError(_("Nom d'utilisateur utilise."))
    def clean_password(self):
            data = self.cleaned_data
            if not self.__is_mode_edit and len(data['password']) == 0:
                forms.ValidationError(_("Nom d'utilisateur utilise."))
            else:
                return data['password']
         
#
#    Formulaire s'occupant de suppriner un element TCO
#
class DeleteForm(forms.Form):
    action = forms.HiddenInput()
    user_id = forms.IntegerField()