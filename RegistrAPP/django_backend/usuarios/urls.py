from django.urls import path
from . import views

urlpatterns = [
    path('register/', views.registrar_usuario, name='registrar_usuario'),
    path('login/', views.login_usuario, name='login_usuario'),
]
