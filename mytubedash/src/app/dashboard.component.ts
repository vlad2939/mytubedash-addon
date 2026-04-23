import {ChangeDetectionStrategy, Component, inject, signal, computed} from '@angular/core';
import {DomSanitizer, SafeResourceUrl} from '@angular/platform-browser';
import {VideoService, Playlist, Video} from './video.service';
import {NgOptimizedImage} from '@angular/common';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-dashboard',
  imports: [], // Nu avem deocamdată dependențe de module externe de UI
  templateUrl: './dashboard.html',
})
export class DashboardComponent {
  // Injectăm serviciul global
  videoService = inject(VideoService);
  sanitizer = inject(DomSanitizer);

  // Semnal pentru controlul Player-ului Video
  activeVideoId = signal<string | null>(null);

  // Computed signal pentru a obține detaliile videoclipului activ (pentru Modal)
  activeVideoPlayerUrl = computed(() => {
    const id = this.activeVideoId();
    if (!id) return null;
    // Căutăm clipul curent
    const video = this.videoService.videos().find(v => v.id === id);
    if (!video) return null;
    
    // Generăm URL-ul securizat pentru iframe-ul YouTube.
    // Important: bypassSecurityTrustResourceUrl oprește filtrarea de securitate la afișarea unui iframe
    const url = `https://www.youtube.com/embed/${video.youtubeId}?autoplay=1&modestbranding=1&rel=0`;
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  });

  /**
   * Deschide playerul setând ID-ul videoului curent
   */
  openVideo(id: string) {
    this.activeVideoId.set(id);
  }

  /**
   * Închide modalul Player-ului de YouTube
   */
  closeVideo() {
    this.activeVideoId.set(null);
  }

  /**
   * Returnează doar videoclipurile asociate unui anumit playlist
   */
  getVideosForPlaylist(playlistId: string): Video[] {
    return this.videoService.videos().filter(v => v.playlistId === playlistId);
  }
}
