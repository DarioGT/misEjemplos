from django.core.management.base import BaseCommand, CommandError
from optparse import make_option
from django_extensions.management.modelviz import generate_dot


class Command(BaseCommand):

    dotdata = generate_dot(args, **options)
    if options['outputfile']:
        self.render_output(dotdata, **options)
    else:
        self.print_output(dotdata)

    def print_output(self, dotdata):
        print(dotdata.encode('utf-8'))

    def render_output(self, dotdata, **kwargs):
        try:
            import pygraphviz
        except ImportError:
            raise CommandError("You need to install pygraphviz python module")

        vizdata = ' '.join(dotdata.split("\n")).strip().encode('utf-8')
        version = pygraphviz.__version__.rstrip("-svn")
        try:
            if [int(v) for v in version.split('.')] < (0, 36):
                # HACK around old/broken AGraph before version 0.36 (ubuntu ships with this old version)
                import tempfile
                tmpfile = tempfile.NamedTemporaryFile()
                tmpfile.write(vizdata)
                tmpfile.seek(0)
                vizdata = tmpfile.name
        except ValueError:
            pass

        graph = pygraphviz.AGraph(vizdata)
        graph.layout(prog=kwargs['layout'])
        graph.draw(kwargs['outputfile'])
