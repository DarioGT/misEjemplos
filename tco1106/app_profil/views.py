# Create your views here.

from django.http import HttpResponse
from django.template import  Context, RequestContext
from django.template.loader import get_template 
from tco.app_admin.security import *
from tco.app_admin.template_config import *    
from django.contrib.auth import authenticate, login, logout
from django.core.context_processors import csrf
from django.contrib.auth.models import User
from django.http import HttpResponseRedirect, HttpResponse
from django.contrib.contenttypes.models import ContentType
from django.contrib.auth.models import Permission

from tco.app_admin.forms import *
from django.contrib.auth.models import Permission
from tco.app_admin.models import *
from django.forms.formsets import formset_factory
from tco.app_admin.security import *
from django.contrib.auth.models import User

def main(request):
   section = 'profil'
    
   response = before_execute_view(request)
   if not response == True:
        return response
    
   template = get_template('pages/profil/default.html');
   cfg = template_config(request)
   cfg.section = section
   
   variables = RequestContext( request,
     {
        'cfg': cfg
     }                  
   )
   
   output = template.render(variables);
   return HttpResponse(output)

def view_changepassword(request):
   section = 'profil'
    
   response = before_execute_view(request)
   if not response == True:
        return response
    
   template = get_template('pages/profil/changepassword.html');
   cfg = template_config(request)
   cfg.section = section
   
   success = 0
   
   if request.method == 'POST':
        user = User.objects.get(pk=request.user.id)
        success = 1
        password =  request.REQUEST['password']
        user.set_password(password)
        user.save()
   
   variables = RequestContext( request,
     {
        'cfg': cfg,
        'success': success
     }                  
   )
   
   output = template.render(variables);
   return HttpResponse(output)


def checkbox_good_value(value):
    if (value == True or value == 'True'):
        return 'on'
    
    return ''

def view_rights(request):
   section = 'profil'
    
   response = before_execute_view(request)
   if not response == True:
        return response
    
   template = get_template('pages/profil/rights.html');
   cfg = template_config(request)
   
   user_id = request.user.id
   user = User.objects.get(pk=user_id)
   perms= list(PermissionAdmin.objects.filter(user=user))
   
   if (len(perms) == 1):
        perm = perms[0]
   else:
        perm = PermissionAdmin()
   
   success = 0
   
   base_url = site_config('base_url')
   cfg.section = section
   data = { 
            'username': user.username ,
            'password' : user.password,
            'email': user.email ,
            'superuser': checkbox_good_value(user.is_superuser),
            'tco_right_read' : checkbox_good_value(perm.tco_right_read),
            'tco_right_write' : checkbox_good_value(perm.tco_right_write),
            'param_right_read' : checkbox_good_value(perm.param_right_read),
            'param_right_write' : checkbox_good_value(perm.param_right_write),
            'profil_right_read' : checkbox_good_value(perm.profil_right_read),
            'profil_right_write' : checkbox_good_value(perm.profil_right_write),
            'scenario_right_read' :checkbox_good_value(perm.scenario_right_read),
            'scenario_right_write' : checkbox_good_value(perm.scenario_right_write),
            'mesure_right_read' : checkbox_good_value(perm.mesure_right_read),
            'mesure_right_write' : checkbox_good_value(perm.mesure_right_write),
            'rapport_right_read' : checkbox_good_value(perm.rapport_right_read),
            
            }
   form = UserForm( initial=data )
   
   variables = RequestContext( request,
     {
        'cfg': cfg,
        'form' : form,
        'success' : success,
        'perm' : perm
     })
   
   output = template.render(variables);
   return HttpResponse(output) 
   