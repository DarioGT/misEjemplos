from django.http import HttpResponse
from extjs.utils import extjs_login_required

@extjs_login_required
def aview(request):
    """View to test extjs_login_required
    """
    return HttpResponse("I was here.")
