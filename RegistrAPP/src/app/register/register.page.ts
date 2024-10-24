import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router'; // Importa el Router para redirección
import { AlertController } from '@ionic/angular'; // Para mostrar alertas si hay errores

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage {
  username: string = '';
  email: string = '';
  password: string = '';

  constructor(
    private http: HttpClient,
    private router: Router, // Inyecta el Router
    private alertController: AlertController // Inyecta el AlertController
  ) {}

  async onRegister() {
    const userData = {
      username: this.username,
      email: this.email,
      password: this.password,
    };

    // Realiza la solicitud de registro
    this.http.post('http://localhost:3000/api/register', userData)
      .subscribe(
        async response => {
          console.log('Registro exitoso', response);

          // Inicia sesión automáticamente después del registro
          this.http.post('http://localhost:3000/api/login', {
            username: this.username,
            password: this.password
          }).subscribe(
            async loginResponse => {
              console.log('Inicio de sesión exitoso', loginResponse);
              const username = this.username;
              localStorage.setItem('user', username);
              // Redirige a la página de inicio (home) con el username
              this.router.navigate(['/home'], {
                state: { user: this.username }
              });
            },
            async error => {
              console.error('Error al iniciar sesión automáticamente', error);
              const alert = await this.alertController.create({
                header: 'Error',
                message: 'No se pudo iniciar sesión automáticamente. Intenta nuevamente.',
                buttons: ['OK'],
              });
              await alert.present();
            }
          );
        },
        async error => {
          console.error('Error en el registro', error);
          const alert = await this.alertController.create({
            header: 'Error',
            message: 'No se pudo completar el registro. Intenta nuevamente.',
            buttons: ['OK'],
          });
          await alert.present();
        }
      );
  }
}
