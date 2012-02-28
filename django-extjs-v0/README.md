revolunet django skeleton ExtJs branch
======================================

this is a branch from [django-skeleton][1] which includes a special django configuration and the django-extjs tools.

There is a sample page with working samples.

owner : [contact@revolunet.com][2]

**It also includes ExtJs stuff :**

 - You need to download and put your [ExtJs][3] 3.1 lib in /apps/main/static/js (due to licence terms)
 - submodules [django-extjs][4], [django-extjs-login][5]

 
**Where do i start ?** 

 - get the source : git clone git://github.com/revolunet/django-skeleton.git django_project
 - use extjs branch : git checkout -b extjs refs/remotes/origin/extjs
 - update the included submodules : git submodule init && git submodule update
 - copy and edit local_settings.py
 - create an empty database
 - create the tables with scripts/manage.py syncdb
 - launch the django dev server with scripts/manage.py runserver
 - open your browser at http://127.0.0.1:8000 to login
 - the main template is located at /apps/main/templates/default.html
 - the main view is located at /apps/main/views.py
 
  [1]: https://github.com/revolunet/django-skeleton
  [2]: mailto:contact@revolunet.com
  [3]: http://www.extjs.com
  [4]: https://github.com/revolunet/django-extjs
  [5]: https://github.com/revolunet/django-extjs-login