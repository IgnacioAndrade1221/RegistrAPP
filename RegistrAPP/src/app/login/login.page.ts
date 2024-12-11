import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular'; 

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  username: string = ''; 
  password: string = ''; 

  constructor(
    private authService: AuthService,
    private router: Router,
    private alertController: AlertController 
  ) {}

  ngOnInit() {
    // Eliminamos la prueba de conexión aquí ya que no es necesaria para el login
    // En vez de esto, hacemos el login cuando el usuario ingresa sus credenciales
  }

  async onLogin() {
    // Verifica si los campos no están vacíos
    if (!this.username || !this.password) {
      const alert = await this.alertController.create({
        header: 'Error',
        message: 'Por favor ingresa tu usuario y contraseña.',
        buttons: ['OK'],
      });
      await alert.present();
      return;
    }
  
    // Llamada al servicio de login
    this.authService.login(this.username, this.password).subscribe(
      async response => {
        console.log('Respuesta del backend:', response);  // Verifica toda la respuesta del backend
  
        // Asegúrate de acceder al campo correcto: response.user.rol
        console.log('Role del usuario:', response.user.rol);  // Accede a 'rol' dentro de 'user'
  
        const role = response.user.rol;  // Accede a 'rol' de 'user'
        const username = this.username;
  
        // Guardamos el usuario y el rol en localStorage
        localStorage.setItem('user', username);
        localStorage.setItem('role', role);
  
        // Redirigir según el rol del usuario
        if (role === 'PROFESOR') {
          this.router.navigate(['/home-admin']); // Redirige a home-admin si el rol es PROFESOR
        } else {
          this.router.navigate(['/home']); // Redirige a home si el rol es USUARIO
        }
      },
      async error => {
        console.error('Error al iniciar sesión:', error);
  
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
    this.router.navigate(['/register']); // Navega a la página de registro
  }
}
