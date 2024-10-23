import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage {
  username: string = '';
  email: string = '';
  password: string = '';

  constructor(private http: HttpClient) {}

  onRegister() {
    const userData = {
      username: this.username,
      email: this.email,
      password: this.password,
    };

    this.http.post('http://localhost:3000/api/register', userData)
      .subscribe(response => {
        console.log('Registro exitoso', response);
      }, error => {
        console.error('Error en el registro', error);
      });
  }
}
