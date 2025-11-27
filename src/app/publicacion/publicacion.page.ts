import { Component } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-publicacion',
  standalone: true,
  templateUrl: './publicacion.page.html',
  styleUrls: ['./publicacion.page.scss'],
  imports: [IonicModule, CommonModule, FormsModule],
})
export class PublicacionPage {

  imagenPreview: string | null = null;

  form = {
    mascotaNombre: '',
    titulo: '',
    descripcion: '',
    fechaInicio: '',
    fechaFin: '',
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
