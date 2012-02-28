import os, sys

BASE_DIR = os.path.realpath(os.path.dirname(__file__))
 


ADMINS = (
     ('Dario Gomez', 'dario@gomez.com'),
)

EMAIL_HOST = 'smtp.neuf.fr'


DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3', # Add 'postgresql_psycopg2', 'postgresql', 'mysql', 'sqlite3' or 'oracle'.
        'NAME': BASE_DIR + '/db/django-skeleton.db',
    }
}




DJANGO_SOURCE = os.path.join(BASE_DIR, '..', '..', 'svn', 'django110')       # specific django version for this project

DATA_PATH = os.path.join(BASE_DIR, 'data')                      # a central place where to store apps datas

HOST = 'http://www.djangoproject.com'                           # your real host



FORCE_LOGIN = True  # first page is always login
LOGIN_URL = '/apps/login'

DEFAULT_VIEW = 'core.views.default'



#-------------------------------------------------------------------------------------------    
# Django settings for easyintranet project.

 

DEBUG = True
LOGGING_DEBUG = 'debug'

TEMPLATE_DEBUG = DEBUG
MANAGERS = ADMINS
USE_MULTITHREADED_SERVER = True
 
MEDIA_ROOT = os.path.join(BASE_DIR, 'core', 'static')
MEDIA_URL = '/static/'

APPEND_SLASH = False
SESSION_EXPIRE_AT_BROWSER_CLOSE = True

TIME_ZONE = 'America/Montreal'
LANGUAGE_CODE = 'fr-CA'
SITE_ID = 1
USE_I18N = True
 
ADMIN_MEDIA_PREFIX = '/admin/media/'
  

# List of callables that know how to import templates from various sources.
TEMPLATE_LOADERS = (
    'django.template.loaders.filesystem.Loader',
    'django.template.loaders.app_directories.Loader',
#    'django.template.loaders.app_directories.load_template_source',
)

TEMPLATE_CONTEXT_PROCESSORS = (
                               "django.contrib.auth.context_processors.auth",
                                "django.core.context_processors.debug",
                                "django.core.context_processors.i18n",
                                "django.core.context_processors.media",
                                "django.core.context_processors.debug")


ROOT_URLCONF = 'core.urls'


# Additional locations of static files
STATICFILES_DIRS = (
#    PPATH + '/static',
    '/home/dario/data/ExtJs/ext-4.0.7-gpl',
#    'd:/data/ExtJs/ext-4.0.7-gpl',
)

#----------------------------------------------------------------------


# ############ #
# DJANGO STUFF #
# ############ #

SECRET_KEY = "z7jc&(scfm-c5lt-h#(m*epqis54tc)lxm=g+&5+ud$3w783dx"


MIDDLEWARE_CLASSES = (      
    'django.middleware.common.CommonMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    #'django.middleware.doc.XViewMiddleware',
    'core.middleware.AJAXSimpleExceptionResponse.AJAXSimpleExceptionResponse'
)

INSTALLED_APPS = (
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',  
    'core.django_concurrent_test_server',    # only for DEV !
    'django.contrib.admin',
    'apps.login',
    'apps.main',
)
