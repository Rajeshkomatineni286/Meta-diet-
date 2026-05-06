from django.urls import path
from .views import PlansRootView, BodyScanView, PlanDetailView, ExportPlanPdfView

urlpatterns = [
    path('', PlansRootView.as_view(), name='plans-root'),
    path('scan/', BodyScanView.as_view(), name='plans-scan'),
    path('export-pdf/', ExportPlanPdfView.as_view(), name='plans-export-pdf'),
    path('<int:pk>/', PlanDetailView.as_view(), name='plans-detail'),
]
