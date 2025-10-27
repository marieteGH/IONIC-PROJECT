import { Component } from '@angular/core';
import { NavController, IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms'; // ⬅️ ¡IMPORTACIÓN CLAVE!

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  
  standalone: true, 
  // Añadimos FormsModule a la lista de imports
  imports: [IonicModule, FormsModule] 
})
export class LoginPage {
  email: string = '';
  password: string = '';

  constructor(private navCtrl: NavController) {}

  login() {
    console.log('Correo:', this.email);
    console.log('Contraseña:', this.password);
    // Aquí va la lógica real de autenticación
  }

  goToRegister() {
    this.navCtrl.navigateForward('/register');
  }
}