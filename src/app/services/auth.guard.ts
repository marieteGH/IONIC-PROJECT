import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private auth: AuthService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree | Observable<boolean | UrlTree> {
    console.log("Guard activado, isAuthenticated:", this.auth.isAuthenticated());
    if (this.auth.isAuthenticated()) {
      return true;
    }
    // Redirigir correctamente a la ruta login FUERA de /tabs
    return this.router.createUrlTree(['/login'], { queryParams: { returnUrl: state.url } });
  }
}