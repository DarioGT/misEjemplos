#
#    Fichier captant les urls dans /tco/
#
#

from django.conf.urls.defaults import *
from tco.app_scenario_profil.views import *

# Uncomment the next two lines to enable the admin:
# from django.contrib import admin
# admin.autodiscover()

urlpatterns = patterns('',
    (r'^$',lst_profil,dict(section='tco')),
    (r'([0-9]+)/edit_profil$',edit_profil),
    (r'([0-9]+)/edit_scenario$',edit_scenario),
    (r'([0-9]+)/delete_profil$',delete_profil,dict(section='tco')),
    (r'([0-9]+)/delete_scenario$',delete_scenario,dict(section='tco')),
    (r'([0-9]+)/scenario/([0-9]+)/mesures$',lst_mesures),
    (r'([0-9]+)/scenario/([0-9]+)/mesures/lst_tco$',ajax_lst_tco_mesures),
    (r'([0-9]+)/scenario/([0-9]+)/mesures/lst_tco_parametres/([0-9]+)$',ajax_lst_tco_mesures_parametre),
    (r'[0-9]+/scenario/[0-9]+/mesures/get_parametre_infos/([0-9]+)$',ajax_get_parametre_infos),
    (r'([0-9]+)/scenario/([0-9]+)/mesures/add$',mesures_add),
    (r'([0-9]+)/scenario/([0-9]+)/mesures/editfromtco/([0-9]+)$',mesures_edit_from_tco),
    (r'([0-9]+)/scenario/([0-9]+)/mesures/editfrommesure/([0-9]+)$',mesures_edit),
    (r'([0-9]+)/scenario/([0-9]+)/mesures/([0-9]+)/edit$',mesures_edit),
    (r'([0-9]+)/scenario/([0-9]+)/mesures/([0-9]+)/delete$',mesures_delete),
    (r'^add$',add_profil,dict(profil_id=-1)),
    (r'([0-9]+)/addScenario$',add_scenario),
)
