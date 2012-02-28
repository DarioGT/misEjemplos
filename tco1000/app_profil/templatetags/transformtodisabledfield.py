from django import template
from tco.app_admin.template_config import *

register = template.Library()


def transformtodisabledfield(field):
    output = field
    return str(output).replace('>','disabled=disabled >')
    

    

register.simple_tag(transformtodisabledfield)
    
