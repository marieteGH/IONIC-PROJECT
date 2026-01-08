import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';
import { ChatService } from '../services/chat.service';
import { AuthService } from '../services/auth.service';
import { Observable } from 'rxjs';
import { addIcons } from 'ionicons';
import { send, arrowBack, personCircleOutline } from 'ionicons/icons';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.page.html',
  styleUrls: ['./chat.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class ChatPage implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private chatService = inject(ChatService);
  private auth = inject(AuthService);

  chatId: string | null = null;
  receptorNombre: string = '';
  nuevoMensaje: string = '';
  mensajes$: Observable<any[]> | null = null;
  misChats$: Observable<any[]> | null = null;
  myUid: string = ''; 

  constructor() {
    addIcons({ send, arrowBack, personCircleOutline });
  }

  ngOnInit() {
    this.myUid = this.auth.getUserId() || ''; // Usando tu función getUserId()

    this.route.queryParams.subscribe(params => {
      this.chatId = params['chatId'] || null;
      this.receptorNombre = params['nombre'] || 'Chat';
      
      if (this.chatId) {
        this.mensajes$ = this.chatService.getMessages(this.chatId);
      } else {
        if (this.myUid) {
          this.misChats$ = this.chatService.getMyChats(this.myUid);
        }
      }
    });
  }

  getNombreChat(chat: any): string {
    if (chat.nombres) {
      const ids = Object.keys(chat.nombres);
      const otroId = ids.find(id => id !== this.myUid);
      return otroId ? chat.nombres[otroId] : 'Usuario';
    }
    return 'Conversación';
  }

  irAChat(chat: any) {
    this.router.navigate(['/tabs/chat'], { 
      queryParams: { chatId: chat.id, nombre: this.getNombreChat(chat) } 
    });
  }

  volverALista() {
    this.chatId = null;
    this.router.navigate(['/tabs/chat'], { queryParams: {} });
  }

  enviar() {
    if (!this.nuevoMensaje.trim() || !this.chatId) return;
    this.chatService.sendMessage(this.chatId, this.myUid, this.nuevoMensaje);
    this.nuevoMensaje = '';
  }
}