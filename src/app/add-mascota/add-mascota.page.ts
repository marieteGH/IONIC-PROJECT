import { Component } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { Auth, authState } from '@angular/fire/auth';
import { MascotasService } from '../services/mascotas.service';

@Component({
  selector: 'app-add-mascota',
  templateUrl: './add-mascota.page.html',
  styleUrls: ['./add-mascota.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, ReactiveFormsModule],
})
export class AddMascotaPage {
  form: FormGroup;
  loading = false;

  constructor(
    private fb: FormBuilder,
    private mascotasService: MascotasService,
    private auth: Auth,
    private router: Router
  ) {
    this.form = this.fb.group({
      nombre: ['', Validators.required],
      especie: [''],
      edad: [null],
      descripcion: ['']
    });
  }

  async submit(): Promise<void> {
    if (this.form.invalid) return;
    this.loading = true;

    const user = await firstValueFrom(authState(this.auth));
    if (!user) {
      this.loading = false;
      await this.router.navigate(['/login']);
      return;
    }

    try {
      await this.mascotasService.createForUser(user.uid, this.form.value);
      await this.router.navigate(['/tabs/mis-mascotas']);
    } catch (err) {
      console.error('Error creando mascota', err);
    } finally {
      this.loading = false;
    }
  }
}