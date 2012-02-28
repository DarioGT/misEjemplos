# Create your views here.

from django.http import HttpResponse
from django.template import  Context, RequestContext
from django.template.loader import get_template 
from django.contrib.auth import authenticate, login, logout
from django.core.context_processors import csrf
from django.contrib.auth.models import User
from django.http import HttpResponseRedirect, HttpResponse
from django.contrib.contenttypes.models import ContentType
from django.contrib.auth.models import Permission
from tco.app_admin.security import *
from tco.app_admin.template_config import *  


def main(request):
   section = 'rapports'
   
   response = before_execute_view(request,section)
   if not response == True:
        return response
   
   template = get_template('pages/rapports/default.html');
   cfg = template_config(request)
   cfg.section = section
   
   variables = RequestContext( request,
     {
        'cfg': cfg
     }                  
   )
   
   output = template.render(variables);
   return HttpResponse(output)
