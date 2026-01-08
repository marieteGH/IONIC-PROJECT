import { Component, EnvironmentInjector, inject, OnDestroy, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { addIcons } from 'ionicons';
// Importamos todos los iconos necesarios
import { home, bookOutline, chatbubbles, create, paw, list } from 'ionicons/icons';
import { AuthService } from '../services/auth.service';
import { ChatService } from '../services/chat.service'; // Importar ChatService
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss'],
  standalone: true,
  imports: [IonicModule, RouterModule],
})
export class TabsPage implements OnInit, OnDestroy {
  public environmentInjector = inject(EnvironmentInjector);
  isLoggedIn = false;
  private sub?: Subscription;
  
  // Inyectamos el ChatService para poder enviarle señales
  private chatService = inject(ChatService);

  constructor(private auth: AuthService) {
    // Registramos los iconos usados en el HTML
    addIcons({ home, 'book-outline': bookOutline, chatbubbles, create, paw, list });
  }

  ngOnInit() {
    this.sub = this.auth.authState$.subscribe((s) => (this.isLoggedIn = s));
  }

  ngOnDestroy() {
    this.sub?.unsubscribe();
  }

  // Esta función se ejecuta cada vez que tocas "Chat" en la barra inferior
  onChatTabClick() {
    // Le dice al servicio: "¡Ey, recarga la lista de chats desde la base de datos!"
    this.chatService.triggerRefresh();
  }
}