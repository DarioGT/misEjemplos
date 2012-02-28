import os.path
from django.utils  import translation
from django.conf.urls.defaults import *
from tco.app_default.views import *

stylesheets = os.path.join(  os.path.dirname(__file__),'public/stylesheets' )
images = os.path.join(  os.path.dirname(__file__),'public/images' )
javascript = os.path.join(  os.path.dirname(__file__),'public/javascript' )

path = os.path.join(  os.path.dirname(__file__))


urlpatterns = patterns('',
    (r'^tco/$',main),
    (r'^tco/invalid_right$',invalid_right),
    (r'^tco/tco/',  include( 'tco.app_tco.urls')),
    (r'^tco/aide/',  include( 'tco.app_aide.urls')),
    (r'^tco/administration/',  include( 'tco.app_admin.urls')),
    (r'^tco/rapports/',  include( 'tco.app_rapports.urls')),
    (r'^tco/profil/',  include('tco.app_profil.urls')),
    (r'^tco/profil_scenario/',  include('tco.app_scenario_profil.urls')),
    #(r'^tco/mesure/',  include('app_mesure.urls')),
    (r'^tco/stylesheets/(?P<path>.*)$', 'django.views.static.serve',
        {'document_root': stylesheets}),
    (r'^tco/images/(?P<path>.*)$', 'django.views.static.serve',
        {'document_root': images}),
    (r'^tco/javascript/(?P<path>.*)$', 'django.views.static.serve',
        {'document_root': javascript}),
    (r'^tco/login/$', view_login),
    (r'^tco/logout/$', view_logout),

)
