from django.urls import path
from rest_framework.routers import DefaultRouter
from .views import AiFixViewSet, chat

router = DefaultRouter()
router.register(r"fixes", AiFixViewSet, basename="ai-fixes")

urlpatterns = router.urls + [
    path("chat/", chat, name="ai-chat"),
]
