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

def main(request):
   section = 'accueil'
    
   response = before_execute_view(request)
   if not response == True:
        return response
    
   #user = User.objects.create_user('test_user', 'lennon@thebeatles.com', '123456')
    
    #user = User.objects.filter(username='pgrimard')
    #user.is_superuser = True
   #user.save()
    
    
    
   #user = User.objects.get(username__exact='pgrimard')
   #user.is_superuser = True
   #user.save() 
   
   template = get_template('pages/default.html');
   cfg = template_config(request)
   cfg.section = section
   
   variables = RequestContext( request,
     {
        'cfg': cfg
     }                  
   )
   
   output = template.render(variables);
   return HttpResponse(output)

def invalid_right(request):
   #user = User.objects.get(username__exact='pgrimard')
   #user.is_superuser = True
   #user.save() 
   
   template = get_template('pages/invalid_right.html');
   cfg = template_config(request)
   cfg.section = 'a'
   
   variables = RequestContext( request,
     {
        'cfg': cfg
     }                  
   )
   
   output = template.render(variables);
   return HttpResponse(output)

def view_login(request):
    template = get_template('registration/login.html');
    
    cfg = template_config(request)

    cfg.section = 'a'
    
    variables = RequestContext( request,
     {
        'success':'true',
        'cfg' : cfg
      }                  
    )
    
    if request.method == 'POST':
        username = request.POST['username']
        password = request.POST['password']
        user = authenticate(username=username, password=password)
        if user is not None:
            if user.is_active:
                login(request,user)
                base_url = site_config('base_url')
                return HttpResponseRedirect( base_url )
                # Redirect to a success page.
            #else:
            #   return HttpResponse('inactif')
        else:
            variables = RequestContext( request,
             {
                'success':'false',
                'cfg' : cfg
             }                  
            )

   
    output = template.render(variables)
        
    return HttpResponse(output)
   
   
def view_logout(request):
    logout(request)
    return HttpResponseRedirect(base_url + 'login')
   
