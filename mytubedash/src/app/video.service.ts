import { Injectable, signal, effect, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

// Interfața pentru un Playlist
export interface Playlist {
  id: string;
  name: string;
}

// Interfața pentru un Clip Video
export interface Video {
  id: string;         // ID-ul unic intern
  title: string;      // Titlul clipului
  youtubeId: string;  // ID-ul YouTube extras din URL
  thumbnail: string;  // Calea către imaginea de thumbnail
  playlistId: string; // ID-ul Playlist-ului de care aparține
}

@Injectable({
  providedIn: 'root'
})
export class VideoService {
  // Semnale (Signals) pentru a păstra și a reactualiza UI-ul atunci când starea se schimbă
  playlists = signal<Playlist[]>([]);
  videos = signal<Video[]>([]);
  
  // Utilizăm inject() pentru a verifica în ce mediu rulăm (Browser vs Server-Side Rendering)
  private platformId = inject(PLATFORM_ID);

  constructor() {
    // 1. Inițializăm datele din localStorage la pornirea aplicației
    this.loadFromStorage();

    // 2. Efect secundar (Effect): De fiecare dată când `playlists` sau `videos` se schimbă,
    //    le salvăm automat și transparent în localStorage.
    effect(() => {
      const p = this.playlists();
      const v = this.videos();
      if (isPlatformBrowser(this.platformId)) {
        localStorage.setItem('mytube-playlists', JSON.stringify(p));
        localStorage.setItem('mytube-videos', JSON.stringify(v));
      }
    });
  }

  /**
   * Încarcă datele din localStorage. 
   * Dacă nu există categorii (Playlists), vom crea câteva conturi standard.
   */
  private loadFromStorage() {
    if (!isPlatformBrowser(this.platformId)) return;
    
    const storedPlaylists = localStorage.getItem('mytube-playlists');
    const storedVideos = localStorage.getItem('mytube-videos');
    
    if (storedPlaylists) {
      try {
        this.playlists.set(JSON.parse(storedPlaylists));
      } catch(e) {
        console.error('Eroare la parsarea playlisturilor:', e);
      }
    } else {
      // Setăm un playlist implicit dacă stocarea este goală
      this.playlists.set([
        { id: 'pl-default', name: 'General' },
        { id: 'pl-music', name: 'Muzică' },
        { id: 'pl-podcasts', name: 'Podcasturi' }
      ]);
    }

    if (storedVideos) {
      try {
        this.videos.set(JSON.parse(storedVideos));
      } catch(e) {
         console.error('Eroare la parsarea videoclipurilor:', e);
      }
    }
  }

  /**
   * Adaugă un playlist nou
   */
  addPlaylist(name: string) {
    const newId = 'pl-' + Date.now();
    this.playlists.update(p => [...p, { id: newId, name }]);
  }

  /**
   * Șterge un playlist pe baza ID-ului.
   * Atenție: Ștergerea unui playlist șterge și toate videoclipurile din acesta.
   */
  removePlaylist(id: string) {
    // Înlăturăm playlist-ul
    this.playlists.update(p => p.filter(playlist => playlist.id !== id));
    // Înlăturăm videoclipurile care erau atâșate la acest playlist
    this.videos.update(v => v.filter(video => video.playlistId !== id));
  }

  /**
   * Adaugă un videoclip nou
   */
  addVideo(video: Omit<Video, 'id'>) {
    const newId = 'v-' + Date.now();
    this.videos.update(v => [...v, { ...video, id: newId }]);
  }

  /**
   * Șterge un videoclip după ID
   */
  removeVideo(id: string) {
    this.videos.update(v => v.filter(video => video.id !== id));
  }
}
