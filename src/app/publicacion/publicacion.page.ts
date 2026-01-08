import { Component, inject, OnInit } from '@angular/core';
import { IonicModule, ToastController, LoadingController, NavController } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Observable } from 'rxjs'; // Necesario para la lista de mascotas

// Servicios y Modelos
import { PublicacionesService } from '../services/publicaciones.service';
import { AuthService } from '../services/auth.service';
import { MascotasService } from '../services/mascotas.service'; // <--- NUEVO
import { Publicacion } from '../models/publicacion';
import { Mascota } from '../models/mascota'; // <--- NUEVO

interface PublicacionForm {
  mascotaNombre: string;
  titulo: string;
  descripcion: string;
  fechaInicio: string | null;
  fechaFin: string | null;
  ubicacion: string;
}

@Component({
  selector: 'app-publicacion',
  standalone: true,
  templateUrl: './publicacion.page.html',
  styleUrls: ['./publicacion.page.scss'],
  imports: [IonicModule, CommonModule, FormsModule],
})
export class PublicacionPage implements OnInit {
  
  // Inyecciones
  private publicacionesService = inject(PublicacionesService);
  private authService = inject(AuthService);
  private mascotasService = inject(MascotasService); // <--- NUEVO
  private toastController = inject(ToastController);
  private loadingController = inject(LoadingController);
  private navCtrl = inject(NavController);

  // Variables
  imagenPreview: string | null = null;
  mascotas$: Observable<Mascota[]> | null = null; // Observable para la lista

  form: PublicacionForm = {
    mascotaNombre: '',
    titulo: '',
    descripcion: '',
    fechaInicio: null,
    fechaFin: null,
    ubicacion: '',
  };

  constructor() {}

  ngOnInit() {
    // Al cargar la página, buscamos las mascotas del usuario
    const userId = this.authService.getUserId();
    if (userId) {
      this.mascotas$ = this.mascotasService.getAllForUser(userId);
    }
  }

  seleccionarImagen() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';

    input.onchange = () => {
      const file = input.files![0];
      if (file) {
        const reader = new FileReader();
        reader.onload = () => {
          this.imagenPreview = reader.result as string;
        };
        reader.readAsDataURL(file);
      }
    };
    input.click();
  }

  async publicar() {
    // Validamos campos
    if (!this.form.titulo || !this.form.mascotaNombre || !this.form.descripcion) {
      this.mostrarToast('Por favor completa todos los campos (Mascota, Título, Descripción)');
      return;
    }

    const userId = this.authService.getUserId();
    if (!userId) {
      this.mostrarToast('Error: Usuario no identificado.');
      return;
    }

    const loading = await this.loadingController.create({
      message: 'Guardando...',
    });
    await loading.present();

    try {
      const nuevaPublicacion: Publicacion = {
        usuarioId: userId,
        mascotaNombre: this.form.mascotaNombre, // Esto vendrá del ion-select
        titulo: this.form.titulo,
        descripcion: this.form.descripcion,
        fechaInicio: this.form.fechaInicio || '',
        fechaFin: this.form.fechaFin || '',
        ubicacion: this.form.ubicacion,
        imagenUrl: this.imagenPreview || '',
        createdAt: Date.now()
      };

      await this.publicacionesService.addPublicacion(nuevaPublicacion);
      
      this.mostrarToast('¡Publicación creada con éxito!');
      this.navCtrl.back();

    } catch (error) {
      console.error('Error al publicar:', error);
      this.mostrarToast('Ocurrió un error al guardar.');
    } finally {
      await loading.dismiss();
    }
  }

  async mostrarToast(mensaje: string) {
    const toast = await this.toastController.create({
      message: mensaje,
      duration: 2000,
      position: 'bottom'
    });
    toast.present();
  }
}