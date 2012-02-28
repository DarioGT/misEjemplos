#from tco.app_admin.template_config import *
from models import  *
from django.http import HttpResponseRedirect, HttpResponse
from tco.settings import BASE_URL

table_perm = 'app_admin_permissionadmin'
base_admin_url =  BASE_URL + 'administration'

def before_execute_view(request, section = ''):
    
    base_url = BASE_URL
    #base_url = site_config('base_url')
    if not request.user.is_authenticated():
        return HttpResponseRedirect( base_url + 'login')
    
    
    
    if (section == 'administration' and not request.user.is_superuser):
        return HttpResponseRedirect( base_url + 'invalid_right')
        
    else: 
        perm = list(PermissionAdmin.objects.filter(user=request.user.id))
        if (len(perm) == 0):
            return HttpResponseRedirect( base_url + 'invalid_right')
        elif (len(perm) == 1):
            if  (section == 'tco'):
                if (perm[0].tco_right_read == 0):
                    return HttpResponseRedirect( base_url + 'invalid_right')
                elif ( request.method == 'POST' and perm[0].tco_right_write == 0   ):
                    return HttpResponseRedirect( base_url + 'invalid_right')
            if  (section == 'profil'):
                if (perm[0].profil_right_read == 0):
                    return HttpResponseRedirect( base_url + 'invalid_right')
                elif ( request.method == 'POST' and perm[0].profil_right_write == 0   ):
                    return HttpResponseRedirect( base_url + 'invalid_right')
            if  (section == 'scenario'):
                if (perm[0].scenario_right_read == 0):
                    return HttpResponseRedirect( base_url + 'invalid_right')
                elif ( request.method == 'POST' and perm[0].scenario_right_write == 0   ):
                    return HttpResponseRedirect( base_url + 'invalid_right')
            if  (section == 'mesure'):
                if (perm[0].mesure_right_read == 0):
                    return HttpResponseRedirect( base_url + 'invalid_right')
                elif ( request.method == 'POST' and perm[0].mesure_right_write == 0   ):
                    return HttpResponseRedirect( base_url + 'invalid_right')
            if  (section == 'rapports'):
                if (perm[0].rapport_right_read == 0):
                    return HttpResponseRedirect( base_url + 'invalid_right')
            
    
    return True

def getUserRights(user_id):
    perm = list(PermissionAdmin.objects.filter(user=user_id))
    if (len(perm) == 1):
        return perm[0]
    else:
        return PermissionAdmin()