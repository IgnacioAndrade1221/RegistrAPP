from django.db import models
from django.contrib.auth.hashers import make_password

class Usuario(models.Model):
    username = models.CharField(max_length=100, unique=True)
    email = models.EmailField(unique=True)
    password = models.CharField(max_length=100)  # Se puede usar CharField, pero se debe cifrar la contraseña

    def set_password(self, raw_password):
        self.password = make_password(raw_password)  # Cifra la contraseña

    def check_password(self, raw_password):
        from django.contrib.auth.hashers import check_password
        return check_password(raw_password, self.password)  # Verifica la contraseña

    def __str__(self):
        return self.username
