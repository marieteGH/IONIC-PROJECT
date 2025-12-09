import { Component, inject } from '@angular/core';
// ✅ FIX TS2305/NG1010: Importaciones individuales de componentes Ionic.
import { NavController, IonContent, IonHeader, IonToolbar, IonTitle, IonButton, IonInput, IonItem, IonList } from '@ionic/angular/standalone'; 
import { FormsModule } from '@angular/forms';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  // ✅ FIX NG1010: Se importan los componentes Ionic usados en el template
  imports: [
    FormsModule,
    IonContent, IonHeader, IonToolbar, IonTitle, IonButton, IonInput, IonItem, IonList
  ]
})
export class LoginPage {
  email: string = '';
  password: string = '';

  private navCtrl: NavController = inject(NavController);
  private auth: AuthService = inject(AuthService);

  constructor() {} 

  login() {
    console.log('Correo:', this.email);
    console.log('Contraseña:', this.password);
    const fakeToken = 'FAKE_TOKEN';
    this.auth.setSession(fakeToken);

    this.navCtrl.navigateRoot('/tabs/booking');
  }

  goToRegister() {
    // ✅ FIX NAVEGACIÓN: Asegura el salto a la página de registro
    this.navCtrl.navigateRoot('/register');
  }
}