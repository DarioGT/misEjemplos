# Django settings for PROTO project.
import os, sys
from django.conf.global_settings import STATIC_URL
PPATH = os.path.realpath(os.path.dirname(__file__)).replace('\\','/')
PPATHBASE = os.path.abspath(os.path.join( PPATH, os.pardir )).replace('\\','/')

# Para encontrar las globales 
sys.path.append(PPATHBASE )

# Django settings 
DEBUG = True
TEMPLATE_DEBUG = DEBUG

ADMINS = (
     ('Dario Gomez', 'dariogomezt@gmail.com'),
)
MANAGERS = ADMINS


DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3', # Add 'postgresql_psycopg2', 'postgresql', 'mysql', 'sqlite3' or 'oracle'.
        'NAME': PPATH + '/db/django-skeleton.db',
    }
}

# Local time zone for this installation. Choices can be found here:
# http://en.wikipedia.org/wiki/List_of_tz_zones_by_name
# although not all choices may be available on all operating systems.
# On Unix systems, a value of None will cause Django to use the same
# timezone as the operating system.
# If running in a Windows environment this must be set to the same as your
# system time zone.
TIME_ZONE = 'America/Montreal'
LANGUAGE_CODE = 'fr-CA'

SITE_ID = 1
# If you set this to False, Django will make some optimizations so as not
# to load the internationalization machinery.
USE_I18N = True

# If you set this to False, Django will not format dates, numbers and
# calendars according to the current locale
USE_L10N = True

#DGT: Formateo de numeros 
USE_THOUSAND_SEPARATOR = True 
NUMBER_GROUPING = 1
#DECIMAL_SEPARATOR = '.'
#THOUSAND_SEPARATOR = ','

 

APPEND_SLASH = False
SESSION_EXPIRE_AT_BROWSER_CLOSE = True


DATA_PATH = os.path.join(PPATH, 'data')                         # a central place where to store apps datas
HOST = 'http://www.djangoproject.com'                           # your real host
EMAIL_HOST = 'smtp.ulaval.ca'
#FORCE_LOGIN = False  # first page is always login
#LOGIN_URL = '/apps/login'



# Django settings for easyintranet project.
MEDIA_ROOT = os.path.join(PPATH, 'media')
MEDIA_URL = '/media/'
ADMIN_MEDIA_PREFIX = '/media/'

USE_DJANGO_JQUERY = True


# Additional locations of static files
STATIC_URL = '/static/'
STATIC_ROOT = PPATH + '/staticx'

STATICFILES_DIRS = (
    PPATHBASE + '/ProtoLib/static', 
    PPATHBASE + '/ProtoLib/globale/admin/media', 
    PPATH + '/static',
    # Put strings here, like "/home/html/static" or "C:/www/django/static".
    # Always use forward slashes, even on Windows.
    # Don't forget to use absolute paths, not relative paths.
)

# List of finder classes that know how to find static files in
# various locations.
STATICFILES_FINDERS = (
    'django.contrib.staticfiles.finders.FileSystemFinder',
    'django.contrib.staticfiles.finders.AppDirectoriesFinder',
#   'django.contrib.staticfiles.finders.DefaultStorageFinder',
)
       

SECRET_KEY = "z7jc&(scfm-c5lt-h#(m*epqis54tc)lxm=g+&5+ud$3w783dx"
    

# List of callables that know how to import templates from various sources.
TEMPLATE_LOADERS = (
    'django.template.loaders.filesystem.Loader',
    'django.template.loaders.app_directories.Loader',
#    'django.template.loaders.eggs.Loader',
)

TEMPLATE_CONTEXT_PROCESSORS = (
    "django.core.context_processors.auth",
    "django.core.context_processors.debug",
    "django.core.context_processors.i18n",
    "django.core.context_processors.media",
    "django.core.context_processors.static",
    "django.core.context_processors.request",
    "django.contrib.messages.context_processors.messages"
    )

MIDDLEWARE_CLASSES = (      
    'django.middleware.common.CommonMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
#    'django.middleware.csrf.CsrfViewMiddleware',
#    'django.contrib.messages.middleware.MessageMiddleware',
#    'core.middleware.AJAXSimpleExceptionResponse.AJAXSimpleExceptionResponse',
)

TEMPLATE_DIRS = (
    # Put strings here, like "/home/html/django_templates" or "C:/www/django/templates".
    # Always use forward slashes, even on Windows.
    # Don't forget to use absolute paths, not relative paths.
)

INSTALLED_APPS = (
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',  
    'django.contrib.staticfiles',
    'apps.main',
)
 

# A sample logging configuration. The only tangible logging
# performed by this configuration is to send an email to
# the site admins on every HTTP 500 error.
# See http://docs.djangoproject.com/en/dev/topics/logging for
# more details on how to customize your logging configuration.
LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'handlers': {
        'mail_admins': {
            'level': 'ERROR',
            'class': 'django.utils.log.AdminEmailHandler'
        }
    },
    'loggers': {
        'django.request': {
            'handlers': ['mail_admins'],
            'level': 'ERROR',
            'propagate': True,
        },
    }
}

ROOT_URLCONF = 'urls'
DEFAULT_VIEW = 'core.views.default'
