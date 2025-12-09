import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private auth: AuthService, private router: Router) {}

  // Ahora manejamos la comprobación de forma asíncrona para esperar
  // a la validación inicial del token en AuthService.
  async canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Promise<boolean | UrlTree> {
    // Esperar a que AuthService haya terminado su inicialización/validación
    const isAuth = await this.auth.isAuthenticatedAsync();
    if (isAuth) {
      return true;
    }
    // Redirigir a login fuera de /tabs y pasar returnUrl
    return this.router.createUrlTree(['/login'], { queryParams: { returnUrl: state.url } });
  }
}