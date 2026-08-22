from django.urls import path
from .views import PlanListView, SubscriptionView, UsageView

urlpatterns = [
    path("plans/", PlanListView.as_view(), name="plans"),
    path("subscription/", SubscriptionView.as_view(), name="subscription"),
    path("usage/", UsageView.as_view(), name="usage"),
]
