from rest_framework import generics
from django.contrib.auth import get_user_model
from .serializers import SignupSerializer

class SignupView(generics.CreateAPIView):
    queryset = get_user_model().objects.all()
    serializer_class = SignupSerializer
    permission_classes = []
