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
    // Prueba de conexión (opcional)
    this.authService.testConnection().subscribe(
      response => {
        console.log('Conexión exitosa:', response); 
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
        
        // Asegúrate de que el backend devuelva el role del usuario
        const role = response.role; // 'profesor' o 'usuario'
        const username = this.username;
  
        // Guarda el usuario y el rol en localStorage
        localStorage.setItem('user', username);
        localStorage.setItem('role', role);
  
        // Redirigir según el rol del usuario
        if (role === 'Profesor') {
          this.router.navigate(['/home-admin']); // Redirige a home-admin si el rol es profesor
        } else {
          this.router.navigate(['/home']); // Redirige a home si el rol es otro
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
