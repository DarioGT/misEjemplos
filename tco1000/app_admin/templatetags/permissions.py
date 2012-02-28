from django import template
from tco.app_admin.template_config import *

register = template.Library()

base_url = site_config('base_url')
 
def permissions( cfg ):
         
    return True       

register.simple_tag(permissions)

