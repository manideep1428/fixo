from rest_framework.routers import DefaultRouter
from .views import AnalysisResultViewSet

router = DefaultRouter()
router.register(r"results", AnalysisResultViewSet, basename="analysis-results")

urlpatterns = router.urls
