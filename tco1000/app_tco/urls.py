#
#    Fichier captant les urls dans /tco/
#
#

from django.conf.urls.defaults import *
from tco.app_tco.views import *

# Uncomment the next two lines to enable the admin:
# from django.contrib import admin
# admin.autodiscover()

urlpatterns = patterns('',
    (r'^$',lst_tco),
    (r'([0-9]+)/parameters$',lst_tco_parametres),
    (r'([0-9]+)/parameters/add$',tco_parametres_add),
    (r'([0-9]+)/parameters/([0-9]+)/edit$',tco_parametres_edit),
    (r'([0-9]+)/parameters/([0-9]+)/delete$',tco_parametres_delete),
    (r'([0-9]+)/move/up$',tco_move,dict(direction='up')),
    (r'([0-9]+)/move/down$',tco_move,dict(direction='down')),
    (r'([0-9]+)/move/under$',tco_move_under),
    (r'([0-9]+)/edit$',edit_tco),
    (r'([0-9]+)/copy$',copy_tco),
    (r'([0-9]+)/delete$',delete_tco),
    (r'add$',add_tco,dict(parent_tco_id=-1)),
    (r'addFromParent/(-?[0-9]+)$',add_tco),
    (r'ajax/lst_tco', ajax_tco_lst)
)



