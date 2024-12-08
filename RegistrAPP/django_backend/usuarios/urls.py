from django.urls import path
from .views import registrar_usuario, login_usuario

urlpatterns = [
    path('register/', registrar_usuario),  
    path('login/', login_usuario),
]
