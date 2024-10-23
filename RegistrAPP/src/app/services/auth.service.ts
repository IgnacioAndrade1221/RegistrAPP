// auth.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:3000/api'; // Asegúrate de que esta URL sea correcta

  constructor(private http: HttpClient) {}

  // Método para probar la conexión
  testConnection(): Observable<any> {
    return this.http.get(`${this.apiUrl}/test`);
  }

  // Método para iniciar sesión
  login(username: string, password: string): Observable<any> {
    const loginData = {
      username: username,
      password: password
    };

    console.log('Datos de inicio de sesión enviados:', loginData); // Para depuración

    return this.http.post(`${this.apiUrl}/login`, loginData);
  }
}
