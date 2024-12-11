from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from .models import Usuario  # Asegúrate de que este sea tu modelo personalizado
import json
from django.contrib.auth.hashers import check_password

@csrf_exempt
def registrar_usuario(request):
    # Manejo para solicitudes OPTIONS
    if request.method == 'OPTIONS':
        return JsonResponse({'message': 'OK'}, status=200)

    if request.method == 'POST':
        try:
            datos = json.loads(request.body)
        except json.JSONDecodeError:
            return JsonResponse({'message': 'Datos inválidos'}, status=400)

        username = datos.get('username')
        email = datos.get('email')
        password = datos.get('password')
        rol = datos.get('rol')

        if not username or not email or not password or not rol:
            return JsonResponse({'message': 'Todos los campos son requeridos'}, status=400)

        if Usuario.objects.filter(email=email).exists():
            return JsonResponse({'message': 'El email ya está en uso'}, status=409)

        usuario = Usuario(username=username, email=email, rol=rol)
        usuario.set_password(password)
        usuario.save()

        return JsonResponse({'message': 'Usuario registrado exitosamente'}, status=201)

    return JsonResponse({'message': 'Método no permitido'}, status=405)


@csrf_exempt
def login_usuario(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        username = data.get('username')
        password = data.get('password')

        if not username or not password:
            return JsonResponse({'message': 'Credenciales faltantes'}, status=400)

        try:
            # Recuperamos el usuario
            user = Usuario.objects.get(username=username)
            
            # Verificamos la contraseña de manera segura
            if not check_password(password, user.password):
                return JsonResponse({'message': 'Credenciales incorrectas'}, status=401)

            # Si la contraseña es correcta
            return JsonResponse({'message': 'Inicio de sesión exitoso', 'user': {'username': user.username, 'email': user.email}}, status=200)

        except Usuario.DoesNotExist:
            return JsonResponse({'message': 'Credenciales incorrectas'}, status=401)

    return JsonResponse({'message': 'Método no permitido'}, status=405)