import {ChangeDetectionStrategy, Component, signal, OnInit, Inject, PLATFORM_ID} from '@angular/core';
import {RouterOutlet, RouterLink, RouterLinkActive} from '@angular/router';
import {isPlatformBrowser} from '@angular/common';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App implements OnInit {
  // Starea pentru tema curentă
  isDarkMode = signal(true);
  
  // Starea vizibilității modalului de documentație (Readme)
  isReadmeModalOpen = signal(false);

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  /**
   * Se rulează la inițializarea componentei. Verifică în localStorage dacă
   * utilizatorul a selectat anterior o preferință legată de temă.
   */
  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      const savedTheme = localStorage.getItem('mytube-theme');
      
      if (savedTheme === 'light') {
        this.isDarkMode.set(false);
        document.documentElement.classList.remove('dark');
      } else {
        this.isDarkMode.set(true);
        document.documentElement.classList.add('dark');
      }
    }
  }

  /**
   * Comută între Dark Mode și Light Mode pe elementul HTML principal.
   */
  toggleTheme() {
    if (isPlatformBrowser(this.platformId)) {
      this.isDarkMode.update(dark => !dark);
      if (this.isDarkMode()) {
        document.documentElement.classList.add('dark');
        localStorage.setItem('mytube-theme', 'dark');
      } else {
        document.documentElement.classList.remove('dark');
        localStorage.setItem('mytube-theme', 'light');
      }
    }
  }

  /**
   * Deschide sau închide modalul pentru Readme din footer
   */
  toggleReadmeModal() {
    this.isReadmeModalOpen.update(v => !v);
  }
}
