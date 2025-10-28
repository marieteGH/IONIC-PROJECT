import { Component, EnvironmentInjector, inject, OnDestroy, OnInit } from '@angular/core';
import { IonTabs, IonTabBar, IonTabButton, IonIcon, IonLabel } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { triangle, ellipse, square } from 'ionicons/icons';
import { AuthService } from '../services/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss'],
  imports: [IonTabs, IonTabBar, IonTabButton, IonIcon, IonLabel],
})
export class TabsPage implements OnInit, OnDestroy {
  public environmentInjector = inject(EnvironmentInjector);
  isLoggedIn = false;
  private sub?: Subscription;

  constructor(private auth: AuthService) {
    addIcons({ triangle, ellipse, square });
  }

  ngOnInit() {
    this.sub = this.auth.authState$.subscribe((s) => (this.isLoggedIn = s));
  }

  ngOnDestroy() {
    this.sub?.unsubscribe();
  }
}