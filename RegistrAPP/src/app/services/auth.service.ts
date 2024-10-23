import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
    providedIn: 'root',
})
export class AuthService {
    private apiUrl = 'http://localhost:3000/api'; // Cambia esto según tu configuración

    constructor(private http: HttpClient) {}

    testConnection(): Observable<any> {
        return this.http.get(`${this.apiUrl}/test`).pipe(
            catchError(this.handleError) // Manejo de errores
        );
    }

    login(username: string, password: string): Observable<any> {
        return this.http.post(`${this.apiUrl}/login`, { username, password }).pipe(
            catchError(this.handleError) // Manejo de errores
        );
    }

    private handleError(error: HttpErrorResponse) {
        let errorMessage = 'Ha ocurrido un error desconocido.';

        if (error.error instanceof ErrorEvent) {
            // Errores del lado del cliente
            errorMessage = `Error: ${error.error.message}`;
        } else {
            // Errores del lado del servidor
            errorMessage = `Código de error: ${error.status}, Mensaje: ${error.message}`;
        }

        console.error(errorMessage); // Para depuración
        return throwError(errorMessage); // Retorna el mensaje de error
    }
}
