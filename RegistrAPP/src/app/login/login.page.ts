import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular'; // Importa AlertController para mostrar alertas

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  username: string = ''; // Inicializa como cadena vacía
  password: string = ''; // Inicializa como cadena vacía

  constructor(
    private authService: AuthService,
    private router: Router,
    private alertController: AlertController // Agrega AlertController aquí
  ) {}

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

  async onLogin() {
    this.authService.login(this.username, this.password).subscribe(
      async response => {
        console.log('Inicio de sesión exitoso:', response);
  
        const username = this.username;
        
        // Guardar el username en localStorage
        localStorage.setItem('user', username);

        // Navegar a 'home' con user
        this.router.navigate(['/home'], {
          state: { user: username }
        }); 
      },
      async error => {
        console.error('Error al iniciar sesión:', error);
        // Muestra una alerta en caso de error
        const alert = await this.alertController.create({
          header: 'Error',
          message: 'Credenciales incorrectas. Inténtalo de nuevo.',
          buttons: ['OK'],
        });
        await alert.present();
      }
    );
  }

  goToRegister() {
    this.router.navigate(['/register']); // Ruta hacia la página de registro
  }
}
