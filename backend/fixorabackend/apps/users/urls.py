from rest_framework.routers import DefaultRouter
from .views import TeamMemberViewSet, ProfileViewSet

router = DefaultRouter()
router.register(r"team", TeamMemberViewSet, basename="team")
router.register(r"profile", ProfileViewSet, basename="profile")

urlpatterns = router.urls
