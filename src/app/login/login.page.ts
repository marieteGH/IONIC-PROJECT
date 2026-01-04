import { Component, inject } from '@angular/core';
// Importamos funciones modulares de Auth
import { Auth, signInWithEmailAndPassword, UserCredential } from '@angular/fire/auth'; 
import { NavController, IonContent, IonHeader, IonToolbar, IonTitle, IonButton, IonInput, IonItem, IonList } from '@ionic/angular/standalone'; 
import { FormsModule } from '@angular/forms';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [
    FormsModule,
    IonContent, IonHeader, IonToolbar, IonTitle, IonButton, IonInput, IonItem, IonList
  ]
})
export class LoginPage {
  email: string = '';
  password: string = '';

  private navCtrl: NavController = inject(NavController);
  private authService: AuthService = inject(AuthService); // Cambiado a authService para evitar conflicto de nombres
  private auth: Auth = inject(Auth); // 💡 Inyectamos el servicio Auth de Firebase Modular

  constructor() {} 

  async login() {
    // 1. Validar que los campos no estén vacíos (aunque el HTML debería hacerlo)
    if (!this.email || !this.password) {
      alert('Por favor, introduce correo y contraseña.');
      return;
    }

    try {
      // 2. LLAMADA REAL A FIREBASE AUTHENTICATION
      const userCredential: UserCredential = await signInWithEmailAndPassword(
        this.auth, 
        this.email, 
        this.password
      );

      // Si la promesa se resuelve, el usuario es válido y está autenticado en Firebase
      const user = userCredential.user;
      console.log('✅ Login exitoso. UID:', user.uid);
      
      // 3. Obtener el token de Firebase y guardarlo en la sesión
      // NOTA: Firebase gestiona la sesión, pero si usas el AuthService para un token local:
      const idToken = await user.getIdToken();
      this.authService.setSession(idToken); 

      // 4. Navegar a la página principal
      this.navCtrl.navigateRoot('/tabs/booking');

    } catch (error: any) {
      // 5. Manejo de errores de inicio de sesión
      console.error('❌ Error de login:', error.code, error.message);

      let errorMessage = 'Error al iniciar sesión. Verifica tus credenciales.';

      switch (error.code) {
        case 'auth/user-not-found':
        case 'auth/wrong-password':
          errorMessage = 'Usuario o contraseña incorrectos.';
          break;
        case 'auth/invalid-email':
          errorMessage = 'El formato del correo electrónico es inválido.';
          break;
        default:
          break;
      }
      
      alert(errorMessage);
    }
  }

  goToRegister() {
    this.navCtrl.navigateRoot('/register');
  }
}