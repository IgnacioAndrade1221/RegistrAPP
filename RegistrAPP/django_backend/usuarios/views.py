from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from .models import Usuario  # Asegúrate de que este sea tu modelo personalizado
import json

@csrf_exempt
def registrar_usuario(request):
    if request.method == 'POST':
        datos = json.loads(request.body)
        username = datos.get('username')
        email = datos.get('email')
        password = datos.get('password')

        if not username or not email or not password:
            return JsonResponse({'message': 'Todos los campos son requeridos'}, status=400)

        if Usuario.objects.filter(email=email).exists():
            return JsonResponse({'message': 'El email ya está en uso'}, status=409)

        # Crear usuario con set_password para cifrar la contraseña
        usuario = Usuario(username=username, email=email)
        usuario.set_password(password)  # Usar set_password para cifrar la contraseña
        usuario.save()

        return JsonResponse({'message': 'Usuario registrado exitosamente'}, status=201)
