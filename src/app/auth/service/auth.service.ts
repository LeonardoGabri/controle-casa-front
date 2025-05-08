import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly pathApi = 'http://localhost:8080/auth/login';
  private readonly TOKEN_KEY = 'auth-token';

  constructor(private http: HttpClient, private router: Router) {}

  login(username: string, password: string): Observable<any> {
    return this.http.post<any>(this.pathApi, { username, password }).pipe(
      tap(response => localStorage.setItem(this.TOKEN_KEY, response.token))
    );
  }

  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    this.router.navigate(['/login']);
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  isAuthenticated(): boolean {
    const token = this.getToken();
    return !!token && !this.isTokenExpired();
  }

  isTokenExpired(): boolean {
    const token = this.getToken();
  if (!token) return true;

  try {
    const payloadPart = token.split('.')[1];
    if (!payloadPart) return true;

    const payload = JSON.parse(atob(payloadPart));
    const exp = payload.exp;

    if (!exp || typeof exp !== 'number') return true;

    return Date.now() / 1000 > exp;
  } catch (e) {
    return true;
  }
  }
}
