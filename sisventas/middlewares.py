import zoneinfo
from django.utils import timezone
from django.utils.deprecation import MiddlewareMixin


class ContentTypeHeaderMiddleware(MiddlewareMixin):
    def process_response(self, request, response):
        content_type = response.get('Content-Type', '')
        if ('javascript' in content_type or 'css' in content_type) and 'charset' not in content_type:
            response['Content-Type'] = content_type + '; charset=utf-8'
        return response


class TimezoneMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        tzname = request.session.get("django_timezone")
        if tzname:
            timezone.activate(zoneinfo.ZoneInfo(tzname))
        else:
            timezone.deactivate()
        return self.get_response(request)
