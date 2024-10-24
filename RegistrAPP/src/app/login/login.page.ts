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
    // conexion
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
  
        const username = this.username;
        
        // guardar user
        localStorage.setItem('user', username);


        this.router.navigate(['/home'], {
          state: { user: username }
        }); 
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
    this.router.navigate(['/register']); 
  }
}
