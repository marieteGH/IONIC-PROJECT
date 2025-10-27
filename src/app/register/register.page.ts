import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule, NavController } from '@ionic/angular'; 
// Importamos AbstractControl para tipado
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, FormsModule, AbstractControl } from '@angular/forms'; 
// Eliminamos la importación de ExploreContainerComponent si no se usa (Warning NG8113)

@Component({
  // Hacemos el componente standalone y añadimos los imports necesarios
  standalone: true,
  // Eliminamos ExploreContainerComponent para deshacernos del warning.
  imports: [IonicModule, CommonModule, ReactiveFormsModule, FormsModule], 
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {
  registerForm!: FormGroup;

  constructor(private fb: FormBuilder, private navCtrl: NavController) {}

  ngOnInit() {
    this.registerForm = this.fb.group({
      // Corregido: Usamos Validators.email para validar el formato de correo
      email: ['', [Validators.required, Validators.email]], 
      username: ['', Validators.required],
      // Corregido: Añadido minLength(6) para que coincida con la validación en el HTML
      password: ['', [Validators.required, Validators.minLength(6)]], 
      birthdate: [''],
    });
  }
  
  // -----------------------------------------------------
  // ⬇️ GETTERS PARA EXPONER LOS CONTROLES EN EL HTML (Resuelve TS2339)
  // -----------------------------------------------------

  get email(): AbstractControl | null {
    return this.registerForm.get('email');
  }

  get username(): AbstractControl | null {
    return this.registerForm.get('username');
  }

  get password(): AbstractControl | null {
    return this.registerForm.get('password');
  }
  
  // -----------------------------------------------------
  
  // Estos métodos son válidos, pero el HTML ya usa los getters para la validación.
  getControl(name: string): AbstractControl | null {
    return this.registerForm.get(name);
  }
  
  isInvalid(name: string): boolean {
    const c = this.getControl(name);
    return !!(c && c.invalid && (c.dirty || c.touched));
  }

  getErrorMessage(name: string): string | null {
    const c = this.getControl(name);
    const errors = c?.errors;
    if (!errors) return null;
    if (errors['required']) return 'Este campo es obligatorio.';
    if (name === 'email' && errors['pattern']) return 'El correo debe contener "@"';
    return 'Campo inválido.';
  }


  onSubmit() {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }
    console.log('Registro válido (mock):', this.registerForm.value);
    

    // Opción 1: Navegar a la página de inicio/dashboard (más común después del registro)
    this.navCtrl.navigateRoot('/home'); 

    // Opción 2: Navegar a la página de login para que el usuario inicie sesión por primera vez
    // this.navCtrl.navigateRoot('/login'); 
    
    

  }
}