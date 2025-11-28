import { Component } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

/**
 * Interfaz para tipificar la estructura del formulario.
 * Se define 'string | null' para las fechas para que sean compatibles
 * con el evento ionChange de ion-datetime, que puede devolver null.
 */
interface PublicacionForm {
  mascotaNombre: string;
  titulo: string;
  descripcion: string;
  fechaInicio: string | string[] | null | undefined; 
  fechaFin: string | string[] | null | undefined;     
  ubicacion: string;
}

@Component({
  selector: 'app-publicacion',
  standalone: true,
  templateUrl: './publicacion.page.html',
  styleUrls: ['./publicacion.page.scss'],
  imports: [IonicModule, CommonModule, FormsModule],
})
export class PublicacionPage {

  imagenPreview: string | null = null;

  // El objeto form ahora está tipificado y sus valores iniciales coinciden con la interfaz.
  form: PublicacionForm = {
    mascotaNombre: '',
    titulo: '',
    descripcion: '',
    fechaInicio: null, // Inicializado como null
    fechaFin: null,    // Inicializado como null
    ubicacion: '',
  };

  constructor() {}

  seleccionarImagen() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';

    input.onchange = () => {
      const file = input.files![0];
      const reader = new FileReader();
      reader.onload = () => this.imagenPreview = reader.result as string;
      reader.readAsDataURL(file);
    };

    input.click();
  }

  publicar() {
    console.log('Formulario:', this.form);
    console.log('Imagen:', this.imagenPreview);
    // Aquí luego añadiremos Firebase
  }
}