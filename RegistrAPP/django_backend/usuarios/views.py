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
        rol = datos.get('rol')  # Asegúrate de obtener el rol

        if not username or not email or not password or not rol:
            return JsonResponse({'message': 'Todos los campos son requeridos'}, status=400)

        if Usuario.objects.filter(email=email).exists():
            return JsonResponse({'message': 'El email ya está en uso'}, status=409)

        # Crear usuario con set_password para cifrar la contraseña
        usuario = Usuario(username=username, email=email, rol=rol)  # Asignar el rol
        usuario.set_password(password)  # Usar set_password para cifrar la contraseña
        usuario.save()

        return JsonResponse({'message': 'Usuario registrado exitosamente'}, status=201)

def login_usuario(request):
    if request.method == 'POST':
        datos = json.loads(request.body)
        username = datos.get('username')
        password = datos.get('password')

        if not username or not password:
            return JsonResponse({'message': 'Credenciales faltantes'}, status=400)

        try:
            usuario = Usuario.objects.get(username=username)
        except Usuario.DoesNotExist:
            return JsonResponse({'message': 'Usuario no encontrado'}, status=404)

        if not usuario.check_password(password):
            return JsonResponse({'message': 'Credenciales incorrectas'}, status=401)

        # Retornar el rol del usuario al iniciar sesión
        return JsonResponse({'message': 'Inicio de sesión exitoso', 'rol': usuario.rol}, status=200)

    return JsonResponse({'message': 'Método no permitido'}, status=405)
