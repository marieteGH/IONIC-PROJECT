import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
// ✅ FIX TS2305/NG1010: Importamos componentes Ionic individuales
import { NavController, IonContent, IonHeader, IonToolbar, IonTitle, IonInput, IonButton, IonItem, IonLabel } from '@ionic/angular/standalone'; 
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms'; 

import { Auth, createUserWithEmailAndPassword } from '@angular/fire/auth';
import { UsuarioService } from '../services/usuario.service';
import { Usuario } from '../models/usuario'; 

@Component({
  standalone: true,
  // ✅ FIX NG1010: Se importan los componentes Ionic individuales (asumiendo los necesarios)
  imports: [
    CommonModule,
    ReactiveFormsModule,
    IonContent, IonHeader, IonToolbar, IonTitle, IonInput, IonButton, IonItem, IonLabel
  ],
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {
  registerForm!: FormGroup;

  private auth: Auth = inject(Auth); 
  private navCtrl: NavController = inject(NavController);
  private fb: FormBuilder = inject(FormBuilder);
  private usuarioService: UsuarioService = inject(UsuarioService);

  constructor() {} 

  // ... (ngOnInit, getters, y onSubmit se mantienen, ya que la lógica es correcta)

  ngOnInit() {
    this.registerForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      username: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]], 
      birthdate: [''],
    });
  }

  get email(): AbstractControl | null { return this.registerForm.get('email'); }
  get username(): AbstractControl | null { return this.registerForm.get('username'); }
  get password(): AbstractControl | null { return this.registerForm.get('password'); }
  
  getControl(name: string): AbstractControl | null { return this.registerForm.get(name); }

  isInvalid(name: string): boolean {
    const c = this.getControl(name);
    return !!(c && c.invalid && (c.dirty || c.touched));
  }
  
  getErrorMessage(name: string): string | null {
    const c = this.getControl(name);
    const errors = c?.errors;
    if (!errors) return null;
    if (errors['required']) return 'Este campo es obligatorio.';
    if (errors['email']) return 'Debe ser un correo electrónico válido.';
    if (errors['minlength']) return `La contraseña debe tener al menos ${errors['minlength'].requiredLength} caracteres.`;
    return 'Campo inválido.';
  }

  async onSubmit() {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    const { email, password, username, birthdate } = this.registerForm.value;

    try {
      console.log('Intentando registrar usuario en Auth...');
      // Usando Auth Modular
      const userCredential = await createUserWithEmailAndPassword(this.auth, email, password);
      
      const firebaseUser = userCredential.user;

      if (firebaseUser) {
        const uid = firebaseUser.uid;

        const userData: Partial<Usuario> = {
          email: email,
          displayName: username,
          birthdate: birthdate || null, 
          roles: { user: true }
        };

        // Usando servicio de Firestore Modular
        await this.usuarioService.setUsuario(uid, userData);
        
        console.log('✅ Registro exitoso. UID:', uid);
        this.navCtrl.navigateRoot('/home'); 
      } else {
        throw new Error("No se pudo obtener la información del usuario después del registro.");
      }

    } catch (error: any) {
      console.error('❌ Error de registro:', error.code, error.message);

      let errorMessage = 'Ocurrió un error al intentar registrarse.';
      
      switch (error.code) {
        case 'auth/email-already-in-use':
          errorMessage = 'El correo electrónico ya está registrado.';
          break;
        case 'auth/invalid-email':
          errorMessage = 'El formato del correo electrónico es incorrecto.';
          break;
        case 'auth/weak-password':
          errorMessage = 'La contraseña debe tener al menos 6 caracteres.';
          break;
        default:
          break;
      }
      
      alert(errorMessage); 
    }
  }
}