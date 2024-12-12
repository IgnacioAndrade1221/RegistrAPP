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
    this.http.post('http://192.168.100.10:3000/api/register/', userData)
    .subscribe(
      async response => {
        console.log('Registro exitoso', response);
  
        // Llamada a login
        this.http.post<LoginResponse>('http://192.168.100.10:3000/api/login/', {
          username: this.username,
          password: this.password
        }).subscribe(
          async (loginResponse: LoginResponse) => {
            console.log('Inicio de sesión exitoso', loginResponse);
            localStorage.setItem('user', this.username);
  
            // Navegación dependiendo del rol
            const role = loginResponse.rol;
            if (role === 'PROFESOR') {
              this.router.navigate(['/home-admin'], { state: { user: this.username, role } });
            } else {
              this.router.navigate(['/home'], { state: { user: this.username, role } });
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
          message: `No se pudo completar el registro. Error: ${error.message}`,
          buttons: ['OK'],
        });
        await alert.present();
      }
    );
  }
}
