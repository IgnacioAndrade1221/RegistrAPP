from django.urls import path
from .views import registrar_usuario

urlpatterns = [
    path('register/', registrar_usuario),
]
