import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { Router } from '@angular/router';
import { Subscription, combineLatest } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { MascotasService } from '../services/mascotas.service';
import { UsuarioService } from '../services/usuario.service';
import { ChatService } from '../services/chat.service';

@Component({
  selector: 'app-booking',
  templateUrl: './booking.page.html',
  styleUrls: ['./booking.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class BookingPage implements OnInit, OnDestroy {
  private authService = inject(AuthService);
  private mascotasService = inject(MascotasService);
  private usuarioService = inject(UsuarioService);
  private chatService = inject(ChatService);
  private router = inject(Router);

  private dataSub?: Subscription;
  
  allCuidadores: any[] = [];
  allMascotas: any[] = [];
  cuidadores: any[] = [];
  mascotas: any[] = [];
  
  searchQuery: string = '';

  ngOnInit() {
    this.dataSub = combineLatest([
      this.usuarioService.listUsuarios(),
      this.mascotasService.getAllForUser('')
    ]).subscribe(([users, pets]) => {
      this.allCuidadores = users;
      this.allMascotas = pets;
      this.filterData(); 
    });
  }

  ngOnDestroy() {
    this.dataSub?.unsubscribe();
  }

  filterData() {
    const query = this.searchQuery.trim().toLowerCase();
    if (!query) {
      this.cuidadores = [...this.allCuidadores];
      this.mascotas = [...this.allMascotas];
      return;
    }
    this.cuidadores = this.allCuidadores.filter(c => 
      (c.nombre && c.nombre.toLowerCase().includes(query)) || 
      (c.displayName && c.displayName.toLowerCase().includes(query)) ||
      (c.email && c.email.toLowerCase().includes(query))
    );
    this.mascotas = this.allMascotas.filter(m => 
      m.nombre?.toLowerCase().includes(query)
    );
  }

  onSearchChange(event: any) {
    this.searchQuery = event.target.value;
    this.filterData();
  }

  abrirChat(item: any) {
    const myUid = this.authService.getUserId();
    // Intenta obtener tu propio nombre si está disponible, si no usa "Yo"
    const myName = "Usuario"; 

    if (!myUid) {
      this.router.navigate(['/login']);
      return;
    }

    const receptorId = item.ownerId || item.uid || item.id; 
    // CAMBIO: Priorizamos nombre/displayName sobre email para el receptor
    const receptorNombre = item.nombre || item.displayName || item.email || 'Usuario';

    if (myUid === receptorId) {
      alert('Esta mascota/perfil es tuyo');
      return;
    }

    this.chatService.getOrCreateChat(myUid, myName, receptorId, receptorNombre).subscribe(chatId => {
      this.router.navigate(['/tabs/chat'], { 
        queryParams: { chatId: chatId, nombre: receptorNombre } 
      });
    });
  }
}