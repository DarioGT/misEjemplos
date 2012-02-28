import os
from setuptools import setup



readme = open(os.path.join(os.path.dirname(__file__), 'README.md')).read()

setup(
        name     = 'django-extjs',
        version  = '0.2-beta3',
        packages = ['extjs'],

        requires = ['python (>= 2.4)', 'django (>= 1.0)'],

        description  = 'Django Form and ModelForm power for your ExtJs apps.',
        long_description = readme,
        author       = 'Julien Bouquillon',
        author_email = 'julien@bouquillon.com',
        url          = 'http://github.com/revolunet/django-extjs',
        download_url = '',
        license      = 'BSD Like?',
        keywords     = 'django extjs forms models',
        classifiers  = [
                    'Development Status :: 4 - Beta',
                    'Environment :: Web Environment',
                    'Framework :: Django',
                    'Intended Audience :: Developers',
                    'Programming Language :: Python',
                    'Topic :: Software Development :: Libraries :: Python  Modules',
                ],
)

