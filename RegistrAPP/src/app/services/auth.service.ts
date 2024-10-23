import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class AuthService {
    private apiUrl = 'http://localhost:3000/api'; // Cambia esto según tu configuración

    constructor(private http: HttpClient) {}

    testConnection(): Observable<any> {
        return this.http.get(`${this.apiUrl}/test`);
    }

    login(username: string, password: string): Observable<any> {
        return this.http.post(`${this.apiUrl}/login`, { username, password });
    }
}
