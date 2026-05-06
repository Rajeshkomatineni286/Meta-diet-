from django.urls import path
from .views import BodyScanView, PlanDetailView
urlpatterns=[path('scan/', BodyScanView.as_view()), path('<int:pk>/', PlanDetailView.as_view())]
