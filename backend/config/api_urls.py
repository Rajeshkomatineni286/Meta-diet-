from django.http import JsonResponse
from django.urls import path, include
from apps.plans.views import ExportPlanPdfView


def api_root(_request):
    return JsonResponse({
        'status': 'ok',
        'message': 'METADIET API LIVE',
    })


urlpatterns = [
    path('', api_root, name='api-root'),
    path('auth/', include('apps.authn.urls')),
    path('users/', include('apps.users.urls')),
    path('plans/', include('apps.plans.urls')),
    path('export-plan/', ExportPlanPdfView.as_view(), name='export-plan'),
    path('payments/', include('apps.payments.urls')),
    path('notifications/', include('apps.notifications.urls')),
    path('analytics/', include('apps.analytics.urls')),
]
