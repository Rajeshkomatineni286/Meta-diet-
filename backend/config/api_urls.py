from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from django.urls import path, include

@api_view(['GET'])
@permission_classes([AllowAny])
def api_root(_request):
    return Response({
        'name': 'METADIET AI API',
        'version': 'v1',
        'endpoints': {
            'auth': '/api/v1/auth/',
            'users': '/api/v1/users/',
            'plans': '/api/v1/plans/',
            'payments': '/api/v1/payments/',
            'notifications': '/api/v1/notifications/',
            'analytics': '/api/v1/analytics/',
        }
    })

urlpatterns = [
    path('', api_root, name='api-root'),
    path('auth/', include('apps.authn.urls')),
    path('users/', include('apps.users.urls')),
    path('plans/', include('apps.plans.urls')),
    path('payments/', include('apps.payments.urls')),
    path('notifications/', include('apps.notifications.urls')),
    path('analytics/', include('apps.analytics.urls')),
]
