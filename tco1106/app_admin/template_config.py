'''
Created on 2010-06-11

@author: pgrimard
'''

#
#    Fichier de configuration qui est utilise dans les templates.
#
#
#

from django.template import  Context
from security import *

base_url = '/tco/'
site     = 'Outil de mesure du cout total de possession'

def template_config(request):
    
     return Context( 
     {
        'base_url': base_url,
        'site' : site,
        'right' : getUserRights(request.user.id)
     })
    
def site_config(var):
    
      if var == 'base_url':
         return base_url
     
     
from django.template import Library, Node
     
register = Library()

    
