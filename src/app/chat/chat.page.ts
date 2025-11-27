import { Component } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-chat',
  standalone: true,
  templateUrl: './chat.page.html',
  styleUrls: ['./chat.page.scss'],
  imports: [IonicModule, CommonModule, FormsModule],
})
export class ChatPage {

  mensajeNuevo: string = '';

  contacto = {
    nombre: 'Paula Guzmán',
    avatar: 'assets/example/avatar-paula.jpg',
    estado: 'Activo hace 11 minutos',
  };

  mensajes = [
    { texto: 'Esta es la plantilla principal de chat', enviado: true, hora: '9:41 a. m.' },
    { texto: 'Ah, sí?', enviado: false, hora: '9:42 a. m.' },
    { texto: 'Genial', enviado: false, hora: '9:42 a. m.' },
    { texto: 'Cómo funciona?', enviado: false, hora: '9:43 a. m.' },
    { texto: 'Solo edita cualquier texto...', enviado: true, hora: '9:44 a. m.' },
    { texto: 'Listo!', enviado: true, hora: '9:44 a. m.' },
  ];

  constructor(private route: ActivatedRoute) {}

  enviarMensaje() {
    if (!this.mensajeNuevo.trim()) return;

    this.mensajes.push({
      texto: this.mensajeNuevo,
      enviado: true,
      hora: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    });

    this.mensajeNuevo = '';
    setTimeout(() => this.scrollToBottom(), 50);
  }

  scrollToBottom() {
    const content = document.querySelector('ion-content');
    content?.scrollToBottom(300);
  }
}
