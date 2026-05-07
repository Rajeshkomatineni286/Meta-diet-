from django.contrib import admin
from django.urls import path, include
from apps.plans.views import ExportPlanPdfView

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/v1/', include('config.api_urls')),
    path('api/export-plan/', ExportPlanPdfView.as_view(), name='export-plan-direct'),
]
