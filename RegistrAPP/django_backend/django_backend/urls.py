from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('django-api/', include('usuarios.urls')),
    path('api/', include('usuarios.urls')),
]
