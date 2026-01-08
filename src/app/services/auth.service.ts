import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly TOKEN_KEY = 'app_token';
  private authState = new BehaviorSubject<boolean>(false);
  readonly authState$ = this.authState.asObservable();

  // inicialización asíncrona para validar token al arrancar
  private initPromise: Promise<void> | null = null;
  private initialized = false;

  constructor() {
    // no navegación desde el servicio (desacoplado)
    this.init();
  }

  getUserId(): string | null {
  const token = this.safeGetItem(this.TOKEN_KEY);
  if (!token) return null;
  
  const payload = this.decodeJwt(token);
  // Asumiendo que el ID viene en 'sub', 'uid' o 'user_id'
  return payload ? (payload.sub || payload.uid || payload.user_id) : null;
}

  // Inicializa y valida el token (si existe)
  private init(): Promise<void> {
    if (this.initPromise) return this.initPromise;
    this.initPromise = (async () => {
      this.initialized = false;
      try {
        const token = this.safeGetItem(this.TOKEN_KEY);
        if (token && this.isTokenValid(token)) {
          this.authState.next(true);
        } else {
          // token inválido/expirado -> limpiar
          this.safeRemoveItem(this.TOKEN_KEY);
          this.authState.next(false);
        }
      } catch {
        this.authState.next(false);
      } finally {
        this.initialized = true;
      }
    })();
    return this.initPromise;
  }

  // Permite a callers esperar hasta que la inicialización termine
  ensureInitialized(): Promise<void> {
    return this.init();
  }

  // Versión async para guards u otros consumidores que necesiten seguridad
  async isAuthenticatedAsync(): Promise<boolean> {
    await this.ensureInitialized();
    return this.authState.value;
  }

  // Chequeo síncrono rápido (útil en componentes donde ya estás suscrito)
  isAuthenticated(): boolean {
    return this.authState.value;
  }

  // Guarda el token y actualiza el estado
  setSession(token: string) {
    try {
      localStorage.setItem(this.TOKEN_KEY, token);
      this.authState.next(true);
    } catch (e) {
      // En caso de fallo de almacenamiento, mantener en no autenticado
      console.error('Error guardando token en localStorage', e);
      this.authState.next(false);
    }
  }

  // Logout: elimina token y actualiza estado. No navega (desacoplado).
  logout() {
    this.safeRemoveItem(this.TOKEN_KEY);
    this.authState.next(false);
  }

  // Método helper si alguien quiere logout + redirección (controlada por quien llama)
  logoutAndRedirect(navigateFn: (path: string) => void, path = '/login') {
    this.logout();
    try {
      navigateFn(path);
    } catch (e) {
      // No forzar fallo si la navegación falla
      console.error('Error al redirigir tras logout', e);
    }
  }

  // --- Helpers internos para validar JWT y acceso a storage ---

  // Validación básica de token JWT (comprueba exp si existe).
  private isTokenValid(token: string): boolean {
    const payload = this.decodeJwt(token);
    if (!payload) return false;
    if (payload.exp && typeof payload.exp === 'number') {
      const now = Math.floor(Date.now() / 1000);
      return payload.exp > now;
    }
    // Si no hay exp, consideramos válido (pero se recomienda backend con exp)
    return true;
  }

  // Decodifica payload de JWT sin librerías externas.
  private decodeJwt(token: string): any | null {
    try {
      const parts = token.split('.');
      if (parts.length !== 3) return null;
      const payload = parts[1].replace(/-/g, '+').replace(/_/g, '/');
      // Ajustar padding
      const pad = payload.length % 4;
      const padded = pad ? payload + '='.repeat(4 - pad) : payload;
      const json = atob(padded);
      return JSON.parse(json);
    } catch {
      return null;
    }
  }

  // Lectura segura de localStorage
  private safeGetItem(key: string): string | null {
    try {
      return localStorage.getItem(key);
    } catch (e) {
      console.error('Error leyendo localStorage', e);
      return null;
    }
  }

  // Eliminación segura de localStorage
  private safeRemoveItem(key: string) {
    try {
      localStorage.removeItem(key);
    } catch (e) {
      console.error('Error eliminando localStorage', e);
    }
  }
}