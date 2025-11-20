import { Component } from '@angular/core';
import { NavController, IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [IonicModule, FormsModule]
})
export class LoginPage {
  email: string = '';
  password: string = '';

  constructor(private navCtrl: NavController, private auth: AuthService) {}

  login() {
    console.log('Correo:', this.email);
    console.log('Contraseña:', this.password);
    // Aquí va la lógica real de autenticación contra tu backend.
    // Si el login es exitoso, guardamos token y navegamos a la tab protegida.
    // Ejemplo con token falso:
    const fakeToken = 'FAKE_TOKEN';
    this.auth.setSession(fakeToken);

    // Navegar a la tab protegida (reemplaza por la ruta que quieras)
    this.navCtrl.navigateRoot('/tabs/booking');
  }

  goToRegister() {
    this.navCtrl.navigateForward('/register');
  }
}