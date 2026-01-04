import { Component } from '@angular/core';
import * as L from 'leaflet';
import {
  // Imports de Ionic (los que no se usan ya están quitados)
  IonContent,
  IonButton,
  IonIcon,
  IonText,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardSubtitle,
  IonCardContent,
  IonImg,
} from '@ionic/angular/standalone';

@Component({
  selector: 'app-booking',
  templateUrl: 'booking.page.html',
  styleUrls: ['booking.page.scss'],
  standalone: true,
  imports: [
    // Componentes de Ionic
    IonContent,
    IonButton,
    IonIcon,
    IonText,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardSubtitle,
    IonCardContent,
    IonImg,
  ],
})
export class BookingPage {
  
  map: L.Map | null = null;
  darkTileLayer: any = null;
  
  // Bandera para evitar recargas
  private mapInitialized: boolean = false;

  constructor() {}

  ionViewDidEnter() {
    // Solo carga el mapa si NO ha sido inicializado antes
    if (!this.mapInitialized) {
      
      // ESPERAMOS UN MOMENTO (150ms) PARA QUE EL CSS SE APLIQUE
      setTimeout(() => {
        this.loadMap();
        this.mapInitialized = true; // Marca como inicializado
      }, 50); // 150ms es un retraso seguro y casi imperceptible

    }
  }


  loadMap() {
    // Coordenadas de ejemplo (Villaviciosa de Odón, Madrid)
    const lat = 40.3546;
    const lng = -3.9038;

    // 1. Inicializa el mapa
    this.map = L.map('map').setView([lat, lng], 14);

    // 2. Añade la capa de "tiles"
    this.darkTileLayer = L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
      subdomains: 'abcd',
      maxZoom: 20
    }).addTo(this.map);

    // 3. Añadir marcadores
    this.addPriceMarkers();
  }

  addPriceMarkers() {
    if (!this.map) return; // Seguridad

    const locations = [
      { lat: 40.358, lng: -3.905, price: 10 },
      { lat: 40.355, lng: -3.900, price: 12 },
      { lat: 40.352, lng: -3.898, price: 13 },
      { lat: 40.351, lng: -3.910, price: 15 },
      { lat: 40.360, lng: -3.895, price: 8 },
    ];

    locations.forEach(loc => {
      const priceIcon = L.divIcon({
        className: 'price-marker', // La clase CSS que definimos
        html: `<div>$${loc.price}</div>`,
        iconSize: [45, 28],   // [ancho, alto]
        iconAnchor: [22, 14]  // [mitad de ancho, mitad de alto]
      });

      L.marker([loc.lat, loc.lng], { icon: priceIcon })
        .addTo(this.map!);
    });
  }
}