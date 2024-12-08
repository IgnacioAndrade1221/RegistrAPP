import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router'; 
import { AlertController } from '@ionic/angular'; 

interface LoginResponse {
  rol: string;
  // Puedes agregar otras propiedades que tenga la respuesta de login si es necesario
}

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage {
  username: string = '';
  email: string = '';
  password: string = '';
  role: string = 'ESTUDIANTE';

  constructor(
    private http: HttpClient,
    private router: Router, 
    private alertController: AlertController 
  ) {}

  async onRegister() {
    const userData = {
      username: this.username,
      email: this.email,
      password: this.password,
      rol: this.role, // Se manda el rol como parte del cuerpo
    };

    // Solicitud de registro
    this.http.post('http://127.0.0.1:8000/django-api/register/', userData)
    .subscribe(
        async response => {
          console.log('Registro exitoso', response);

          // Iniciar sesión automáticamente después de registrar
          this.http.post<LoginResponse>('http://127.0.0.1:8000/api/login/', {
            username: this.username,
            password: this.password
          }).subscribe(
            async (loginResponse: LoginResponse) => {  // Ahora usamos la interfaz LoginResponse
              console.log('Inicio de sesión exitoso', loginResponse);
              const username = this.username;
              localStorage.setItem('user', username);

              // Obtener el rol desde la respuesta
              const role = loginResponse.rol;  // Ahora TypeScript sabe que "rol" existe

              // Redirigir según el rol del usuario
              if (role === 'PROFESOR') {
                this.router.navigate(['/home-admin'], {
                  state: { user: this.username, role: role }
                });
              } else {
                this.router.navigate(['/home'], {
                  state: { user: this.username, role: role }
                });
              }
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
