import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

// Definición de las interfaces para la tipificación
interface Cuidador {
  id: number;
  nombre: string;
  imagenUrl: string;
  rating: number; // 1 a 5
}

interface Mascota {
  id: number;
  nombre: string;
  imagenUrl: string;
}

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html', 
  styleUrls: ['./home.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class HomePage implements OnInit {

  // Variables para enlazar al HTML
  cuidadores: Cuidador[] = [];
  mascotas: Mascota[] = [];

  constructor() { }

  ngOnInit() {
    this.cargarDatosIniciales();
  }

  // Carga de Datos Simulada
  cargarDatosIniciales() {
    this.cuidadores = [
      { id: 1, nombre: 'Joaquín', imagenUrl: 'https://via.placeholder.com/150/0000FF/808080?text=Joaquin', rating: 4 },
      { id: 2, nombre: 'YONCOBRA', imagenUrl: 'https://via.placeholder.com/150/FF0000/FFFFFF?text=YonCobra', rating: 3 },
      { id: 3, nombre: 'Elena G.', imagenUrl: 'https://via.placeholder.com/150/00FF00/000000?text=Elena', rating: 5 },
    ];

    this.mascotas = [
      { id: 10, nombre: 'Rodolfo', imagenUrl: 'https://via.placeholder.com/150/00FF00/000000?text=Rodolfo' }, 
      { id: 11, nombre: 'Angustias', imagenUrl: 'https://via.placeholder.com/150/00FF00/000000?text=Angustias' },
      { id: 12, nombre: 'Max', imagenUrl: 'https://via.placeholder.com/150/00FF00/000000?text=Max' },
    ];
  }

  // Función para la barra de búsqueda
  onSearchChange(event: any) {
    const query = event.target.value.toLowerCase();
    console.log('Buscando:', query);
    // Aquí se implementaría la lógica de filtrado real
  }

  // Función para manejar el display de las estrellas de rating
  getStarIcon(rating: number, starPosition: number): string {
    if (rating >= starPosition) {
      return 'star'; 
    } else if (rating >= starPosition - 0.5) {
      return 'star-half'; 
    } else {
      return 'star-outline'; 
    }
  }
  
  // Métodos de navegación (simulados)
  verDetalleCuidador(id: number) {
    console.log(`Navegando al detalle del cuidador ${id}`);
    // Usar el Router de Angular para navegar
  }

  verDetalleMascota(id: number) {
    console.log(`Navegando al detalle de la mascota ${id}`);
    // Usar el Router de Angular para navegar
  }
}