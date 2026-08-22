from rest_framework.routers import DefaultRouter
from .views import WebsiteViewSet

router = DefaultRouter()
router.register(r"", WebsiteViewSet, basename="websites")

urlpatterns = router.urls
