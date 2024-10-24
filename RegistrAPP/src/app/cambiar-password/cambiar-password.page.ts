import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ToastController } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cambiar-password',
  templateUrl: './cambiar-password.page.html',
  styleUrls: ['./cambiar-password.page.scss'],
})
export class CambiarPasswordPage {
  username: string = '';
  oldPassword: string = '';
  newPassword: string = '';
  errorMessage: string = '';

  constructor(private http: HttpClient, private toastController: ToastController, private router: Router) {}

  async presentToast(message: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000,
      position: 'top', // Puedes ajustar la posición
    });
    await toast.present();
  }

  onChangePassword() {

    const username = localStorage.getItem('username');

    const passwordData = {
      username: username,
      oldPassword: this.oldPassword,
      newPassword: this.newPassword,
    };

    this.http.post('http://localhost:3000/api/change-password', passwordData)
      .subscribe(response => {
        console.log('Contraseña cambiada exitosamente', response);
        this.presentToast('Contraseña actualizada con éxito');
        const username = this.username;
        localStorage.setItem('user', username);
        // Redirige a la página de inicio (home) con el username
        this.router.navigate(['/home'], {
          state: { user: this.username }
        });
      }, error => {
        console.error('Error al cambiar la contraseña', error);
        this.errorMessage = error.error.message || 'Error al cambiar la contraseña';
        this.presentToast(this.errorMessage);
      });
  }
}
