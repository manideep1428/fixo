from django.urls import re_path

from .consumers import ScanProgressConsumer

websocket_urlpatterns = [
    re_path(r"^ws/scans/(?P<scan_id>[\w-]+)/$", ScanProgressConsumer.as_asgi()),
]
