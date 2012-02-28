
# Create your views here.

from django.http import HttpResponse
from django.template import  Context, RequestContext
from django.template.loader import get_template 
from template_config import *     
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

table_perm = 'app_admin_permissionadmin'
base_url = site_config('base_url')
base_admin_url =  base_url + 'administration'

def main(request):
   section = 'administration'
   
   response = before_execute_view(request)
   if not response == True:
        return response
    
   template = get_template('pages/administration/default.html');
   cfg = template_config(request)
   cfg.section = 'administration'
   
   
   #user = User.objects.get(username__exact='pgrimard')
   #user.is_superuser = True
   #user.save() 

   
   variables = RequestContext( request,
     {
        'cfg': cfg
        
     }                  
   )
   
   
   output = template.render(variables);
   return HttpResponse(output)

def lst_user(request):
   section = 'administration'
    
   response = before_execute_view(request)
   if not response == True:
        return response
    
   template = get_template('pages/administration/user_lst.html');
   cfg = template_config(request)
   cfg.section = 'administration'
   cfg.page = 'admin list users'
   
   userstmp = list(User.objects.all())
   
   users = []
   
   for user in userstmp:
       perms = list(PermissionAdmin.objects.filter(user=user))
       
       if (len(perms) == 1):
            perm = perms[0]
            if perm.is_expert == False or user.is_superuser:
                users.append(user)
   
   variables = RequestContext( request,
     {
        'cfg': cfg,
        'lst_users': users
     }                  
   )
   
   output = template.render(variables);
   return HttpResponse(output)

def add_user(request):
   section = 'administration'
   
   response = before_execute_view(request)
   if not response == True:
        return response
    
   template = get_template('pages/administration/user_add.html');
   cfg = template_config(request)
   cfg.section = 'administration'
   cfg.page = 'admin users add'
   
   form = UserForm()
   
   
   user = User()
   success = 0
   
   base_url = site_config('base_url')
   
   test = ''
   
   if request.method == 'POST':
        if request.POST.get('action') == 'Annuler':
            return HttpResponseRedirect( base_admin_url + '/user')
        form = UserForm(request.POST)
        
        if form.is_valid():
            success = 1
            
            username = form.cleaned_data['username']
            password = form.cleaned_data['password']
            email =  form.cleaned_data['email']
            
            user = User.objects.create_user(username, email, password)
            user.is_superuser = form.cleaned_data['superuser'] == 'on'
            user.save()
            perm = PermissionAdmin()
            
            perm.user = user
            perm.tco_right_read = form.cleaned_data['tco_right_read']  == 'on'
            perm.tco_right_write = form.cleaned_data['tco_right_write'] == 'on'
            perm.param_right_read = form.cleaned_data['param_right_read'] == 'on'
            perm.param_right_write = form.cleaned_data['param_right_write'] == 'on'
            perm.profil_right_read = form.cleaned_data['profil_right_read'] == 'on'
            perm.profil_right_write = form.cleaned_data['profil_right_write'] == 'on'
            perm.scenario_right_read = form.cleaned_data['scenario_right_read'] == 'on'
            perm.scenario_right_write = form.cleaned_data['scenario_right_write'] == 'on'
            perm.mesure_right_read = form.cleaned_data['mesure_right_read'] == 'on'
            perm.mesure_right_write = form.cleaned_data['mesure_right_write'] == 'on'
            perm.rapport_right_read = form.cleaned_data['rapport_right_read'] == 'on'
            perm.is_expert = False
            
            perm.save()
        else:
            success = 0
   else:
        form = UserForm()
   
   variables = RequestContext( request,
     {
        'cfg': cfg,
        'form' : form,
        'success' : success
     }                  
   )
   
   output = template.render(variables);
   return HttpResponse(output)

def checkbox_good_value(value):
    if (value == True or value == 'True'):
        return 'on'
    
    return ''
    

def edit_user(request,user_id):
   section = 'administration'
   
   response = before_execute_view(request)
   if not response == True:
        return response
    
   template = get_template('pages/administration/user_edit.html');
   cfg = template_config(request)
   cfg.section = 'administration'
   
   
   user = User.objects.get(pk=user_id)
   perms= list(PermissionAdmin.objects.filter(user=user))
   
   if (len(perms) == 1):
        perm = perms[0]
   else:
        perm = PermissionAdmin()
   
   success = 0
   
   base_url = site_config('base_url')
   
   if request.method == 'POST':
        if request.POST.get('action') == 'Annuler':
            return HttpResponseRedirect( base_admin_url + '/user')
        form = UserFormEdit(request.POST)
        form.isModeEdit(True)
        
        if form.is_valid():
            success = 1
            
            username = form.cleaned_data['username']
            #password = form.cleaned_data['password']
            email =  form.cleaned_data['email']
            is_superadmin =  form.cleaned_data['superuser'] == 'on'
            
            #user.password = password
            user.username = username
            user.is_superuser = is_superadmin
            user.save()
            
            perm.user = user
            perm.tco_right_read = form.cleaned_data['tco_right_read'] == 'on'
            perm.tco_right_write = form.cleaned_data['tco_right_write'] == 'on'
            perm.param_right_read = form.cleaned_data['param_right_read'] == 'on'
            perm.param_right_write = form.cleaned_data['param_right_write'] == 'on'
            perm.profil_right_read = form.cleaned_data['profil_right_read'] == 'on'
            perm.profil_right_write = form.cleaned_data['profil_right_write'] == 'on'
            perm.scenario_right_read = form.cleaned_data['scenario_right_read'] == 'on'
            perm.scenario_right_write = form.cleaned_data['scenario_right_write'] == 'on'
            perm.mesure_right_read = form.cleaned_data['mesure_right_read'] == 'on'
            perm.mesure_right_write = form.cleaned_data['mesure_right_write'] == 'on'
            perm.rapport_right_read = form.cleaned_data['rapport_right_read'] == 'on'
            
            perm.save()
        else:
            success = 0
   else:
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

def delete_user(request,user_id):
   section = 'administration'
    
   response = before_execute_view(request)
   if not response == True:
        return response
    
   template = get_template('pages/administration/user_delete.html');
   cfg = template_config(request)
   cfg.current_url = '/administration/'
   section = ''
   cfg.section = section
   success = 0
   
   base_url = site_config('base_url')
   debug = ''
   
   if request.method == 'POST':
       if request.POST.get('action') == 'Annuler':
            return HttpResponseRedirect( base_admin_url + '/user' )
        
       deleteForm = DeleteForm( request.POST )
       
       if request.POST.get('action','') == 'delete':
           u = User.objects.get(pk=user_id)
           u.delete()
           
           success = 1
       
   else:
        deleteForm = DeleteForm( { 'action':'delete','user_id': user_id }  )
       
   variables = RequestContext(request, 
     {
        'form' : deleteForm,
        'cfg': cfg,
        'user_id': user_id,
        'request':request,
        'success': success
     }                  
                    
   )
   
   output = template.render(variables);
   return HttpResponse(output)   
  

def lst_user_expert(request):
   section = 'administration'
    
   response = before_execute_view(request)
   if not response == True:
        return response
    
   template = get_template('pages/administration/user_expert_lst.html');
   cfg = template_config(request)
   cfg.section = 'administration'
   cfg.page = 'admin users expert list'
   
   userstmp = list(User.objects.all())
   
   users = []
   
   for user in userstmp:
       perms = list(PermissionAdmin.objects.filter(user=user))
       
       if (len(perms) == 1):
            perm = perms[0]
            if perm.is_expert == True:
                users.append(user)
   
   variables = RequestContext( request,
     {
        'cfg': cfg,
        'lst_users': users
     }                  
   )
   
   output = template.render(variables);
   return HttpResponse(output)

def add_user_expert(request):
   section = 'administration'
   
   response = before_execute_view(request)
   if not response == True:
        return response
    
   template = get_template('pages/administration/user_expert_add.html');
   cfg = template_config(request)
   cfg.section = 'administration'
   cfg.page = 'admin users expert add'
   
   form = UserForm()
   
   user = User()
   success = 0
   
   base_url = site_config('base_url')
   
   test = ''
   
   if request.method == 'POST':
        if request.POST.get('action') == 'Annuler':
            return HttpResponseRedirect( base_admin_url + '/user_expert')
        form = UserForm(request.POST)
        
        if form.is_valid():
            success = 1
            
            username = form.cleaned_data['username']
            password = form.cleaned_data['password']
            email =  form.cleaned_data['email']
            
            user = User.objects.create_user(username, email, password)
            user.is_superuser = form.cleaned_data['superuser'] == 'on'
            user.save()
            perm = PermissionAdmin()
            
            perm.user = user
            perm.tco_right_read = form.cleaned_data['tco_right_read']  == 'on'
            perm.tco_right_write = form.cleaned_data['tco_right_write'] == 'on'
            perm.param_right_read = form.cleaned_data['param_right_read'] == 'on'
            perm.param_right_write = form.cleaned_data['param_right_write'] == 'on'
            perm.profil_right_read = form.cleaned_data['profil_right_read'] == 'on'
            perm.profil_right_write = form.cleaned_data['profil_right_write'] == 'on'
            perm.scenario_right_read = form.cleaned_data['scenario_right_read'] == 'on'
            perm.scenario_right_write = form.cleaned_data['scenario_right_write'] == 'on'
            perm.mesure_right_read = form.cleaned_data['mesure_right_read'] == 'on'
            perm.mesure_right_write = form.cleaned_data['mesure_right_write'] == 'on'
            perm.rapport_right_read = form.cleaned_data['rapport_right_read'] == 'on'
            perm.is_expert = True
            perm.save()
        else:
            success = 0
   else:
        form = UserForm()
   
   variables = RequestContext( request,
     {
        'cfg': cfg,
        'form' : form,
        'success' : success
     }                  
   )
   
   output = template.render(variables);
   return HttpResponse(output)

def edit_user_expert(request,user_id):
   section = 'administration'
   
   response = before_execute_view(request)
   if not response == True:
        return response
    
   template = get_template('pages/administration/user_expert_edit.html');
   cfg = template_config(request)
   cfg.section = 'administration'
   
   
   user = User.objects.get(pk=user_id)
   perms= list(PermissionAdmin.objects.filter(user=user))
   
   if (len(perms) == 1):
        perm = perms[0]
   else:
        perm = PermissionAdmin()
   
   success = 0
   
   base_url = site_config('base_url')
   
   if request.method == 'POST':
        if request.POST.get('action') == 'Annuler':
            return HttpResponseRedirect( base_admin_url + '/user_expert')
        form = UserFormEdit(request.POST)
        form.isModeEdit(True)
        
        if form.is_valid():
            success = 1
            
            username = form.cleaned_data['username']
            email =  form.cleaned_data['email']
            is_superadmin =  form.cleaned_data['superuser'] == 'on'
            
            user.username = username
            user.save()
            
            perm.user = user
            perm.tco_right_read = form.cleaned_data['tco_right_read'] == 'on'
            perm.tco_right_write = form.cleaned_data['tco_right_write'] == 'on'
            perm.param_right_read = form.cleaned_data['param_right_read'] == 'on'
            perm.param_right_write = form.cleaned_data['param_right_write'] == 'on'
            perm.profil_right_read = form.cleaned_data['profil_right_read'] == 'on'
            perm.profil_right_write = form.cleaned_data['profil_right_write'] == 'on'
            perm.scenario_right_read = form.cleaned_data['scenario_right_read'] == 'on'
            perm.scenario_right_write = form.cleaned_data['scenario_right_write'] == 'on'
            perm.mesure_right_read = form.cleaned_data['mesure_right_read'] == 'on'
            perm.mesure_right_write = form.cleaned_data['mesure_right_write'] == 'on'
            perm.rapport_right_read = form.cleaned_data['rapport_right_read'] == 'on'
            
            perm.save()
        else:
            success = 0
   else:
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

def delete_user_expert(request,user_id):
   section = 'administration'
    
   response = before_execute_view(request)
   if not response == True:
        return response
    
   template = get_template('pages/administration/user_expert_delete.html');
   cfg = template_config(request)
   cfg.current_url = '/administration/'
   section = ''
   cfg.section = section
   success = 0
   
   base_url = site_config('base_url')
   debug = ''
   
   if request.method == 'POST':
       if request.POST.get('action') == 'Annuler':
            return HttpResponseRedirect( base_admin_url + '/user_expert' )
        
       deleteForm = DeleteForm( request.POST )
       
       if request.POST.get('action','') == 'delete':
           u = User.objects.get(pk=user_id)
           u.delete()
           
           success = 1
       
   else:
        deleteForm = DeleteForm( { 'action':'delete','user_id': user_id }  )
       
   variables = RequestContext(request, 
     {
        'form' : deleteForm,
        'cfg': cfg,
        'user_id': user_id,
        'request':request,
        'success': success
     }                  
                    
   )
   
   output = template.render(variables);
   return HttpResponse(output)   
