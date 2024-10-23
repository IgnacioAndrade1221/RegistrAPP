import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service'; // Ajusta la ruta aquí
import { Router } from '@angular/router'; // Importa Router para redirigir después de iniciar sesión

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  username: string = ''; // Inicializa como cadena vacía
  password: string = ''; // Inicializa como cadena vacía

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit() {
    // Verifica la conexión al servidor al iniciar
    this.authService.testConnection().subscribe(
      response => {
        console.log('Conexión exitosa:', response); // Deberías ver la respuesta en la consola
      },
      error => {
        console.error('Error al conectar con el servidor:', error);
      }
    );
  }

  onLogin() {
    // Llama al método de inicio de sesión del servicio de autenticación
    this.authService.login(this.username, this.password).subscribe(
      response => {
        console.log('Inicio de sesión exitoso:', response);
        this.router.navigate(['/home']); // Cambia '/home' por la ruta que desees
      },
      error => {
        console.error('Error al iniciar sesión:', error);
        // Maneja el error, muestra un mensaje al usuario si es necesario
      }
    );
  }
}
