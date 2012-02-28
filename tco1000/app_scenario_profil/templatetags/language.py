from django import template
from tco.app_tco.template_config import *
from django.utils import translation
from django.utils.cache import patch_vary_headers
import gettext
from django.conf import  settings

register = template.Library()

base_url = site_config('base_url')

def activateLng(key):
    translation.activate(key)
    return ''

register.simple_tag(activateLng)
