// main.ts
import { bootstrapApplication } from '@angular/platform-browser';
import { RouteReuseStrategy, provideRouter, withPreloading, PreloadAllModules } from '@angular/router';
import { IonicRouteStrategy, provideIonicAngular } from '@ionic/angular/standalone';

import { routes } from './app/app.routes';
import { AppComponent } from './app/app.component';

// Importaciones de Firebase Modular
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { provideAuth, getAuth } from '@angular/fire/auth';
import { provideFirestore, getFirestore } from '@angular/fire/firestore';
import { environment } from './environments/environment';
import { provideStorage, getStorage } from '@angular/fire/storage'; // 💡 Añadido para StorageService

// Usa la configuración del entorno (asumimos que environment.firebase es correcto)
const firebaseConfig = environment.firebase; 

if (!firebaseConfig) {
  console.error('ERROR CRÍTICO: No se encontró la configuración "firebase" en environment.ts. Verifica el archivo.');
  throw new Error('Fallo de inicialización de Firebase.');
}

bootstrapApplication(AppComponent, {
  providers: [
    // Ionic + routing
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    provideIonicAngular(),
    provideRouter(routes, withPreloading(PreloadAllModules)),

    // ✅ CONFIGURACIÓN MODULAR ESTABLE
    provideFirebaseApp(() => initializeApp(firebaseConfig)),
    provideAuth(() => getAuth()),       // Proveedor de Autenticación Modular
    provideFirestore(() => getFirestore()), // Proveedor de Firestore Modular
    provideStorage(() => getStorage()), // Proveedor de Storage Modular (para StorageService)
  ]
});