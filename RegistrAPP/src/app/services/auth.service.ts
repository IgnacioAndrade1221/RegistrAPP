import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:8000/api'; // Aquí va la IP local de tu computadora

  constructor(private http: HttpClient) {}

  // probar conexión
  testConnection(): Observable<any> {
    return this.http.get(`${this.apiUrl}/test`);
  }

  // iniciar sesión
  login(username: string, password: string): Observable<any> {
    const loginData = {
      username: username,
      password: password
    };

    console.log('Datos de inicio de sesión enviados:', loginData);

    return this.http.post(`${this.apiUrl}/login/`, loginData);
  }
}
