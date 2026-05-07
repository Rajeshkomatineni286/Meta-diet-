from django.urls import path
from .views import NotifyPreview
urlpatterns=[path('send/', NotifyPreview.as_view())]
