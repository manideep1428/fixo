from rest_framework.routers import DefaultRouter
from .views import ScanJobViewSet

router = DefaultRouter()
router.register(r"", ScanJobViewSet, basename="scans")

urlpatterns = router.urls
