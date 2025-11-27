import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private TOKEN_KEY = 'app_token';
  private authState = new BehaviorSubject<boolean>(false);
  authState$ = this.authState.asObservable();

  constructor(private router: Router) {
    const token = localStorage.getItem(this.TOKEN_KEY);
    this.authState.next(!!token);
  }



  isAuthenticated(): boolean { 
    return this.authState.value;
  }

  setSession(token: string) {
    localStorage.setItem(this.TOKEN_KEY, token);
    this.authState.next(true);
  }

  logout() {
    localStorage.removeItem(this.TOKEN_KEY);
    this.authState.next(false);
    this.router.navigateByUrl('/login', { replaceUrl: true }); // <-- CAMBIO AQUÍ
  }
}