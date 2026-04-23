import {ChangeDetectionStrategy, Component, inject, signal} from '@angular/core';
import {ReactiveFormsModule, FormBuilder, Validators} from '@angular/forms';
import {VideoService} from './video.service';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-settings',
  imports: [ReactiveFormsModule],
  templateUrl: './settings.html',
})
export class SettingsComponent {
  videoService = inject(VideoService);
  private fb = inject(FormBuilder);

  // Formular pentru crearea unui NOU Playlist
  playlistForm = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(2)]]
  });

  // Formular pentru adăugarea unui Clip Video manual
  videoForm = this.fb.group({
    title: ['', Validators.required],
    playlistId: ['', Validators.required],
    youtubeUrl: ['', [Validators.required, Validators.pattern(/^(https?\:\/\/)?(www\.youtube\.com|youtu\.?be)\/.+$/)]],
    thumbnailMethod: ['auto', Validators.required], // 'auto' sau 'manual'
    manualThumbnail: [''] // url / cale manuală către thumbnail (dacă user-ul alege metoda asta)
  });

  addPlaylist() {
    if (this.playlistForm.valid) {
      this.videoService.addPlaylist(this.playlistForm.value.name!);
      this.playlistForm.reset();
    }
  }

  deletePlaylist(id: string) {
    if (confirm('Ești sigur că vrei să ștergi acest playlist și toate videoclipurile din el?')) {
      this.videoService.removePlaylist(id);
    }
  }

  addVideo() {
    if (this.videoForm.valid) {
      const v = this.videoForm.value;
      const youtubeId = this.extractYoutubeId(v.youtubeUrl!);
      
      let finalThumbnail = v.manualThumbnail;
      // Dacă alege varianta auto, generăm imaginea default Youtube maxres
      if (v.thumbnailMethod === 'auto' || !finalThumbnail) {
        finalThumbnail = `https://img.youtube.com/vi/${youtubeId}/mqdefault.jpg`;
      }

      this.videoService.addVideo({
        title: v.title!,
        youtubeId: youtubeId!,
        thumbnail: finalThumbnail,
        playlistId: v.playlistId!
      });

      this.videoForm.reset({ thumbnailMethod: 'auto' });
    }
  }

  deleteVideo(id: string) {
    if (confirm('Ești sigur că vrei să ștergi acest videoclip?')) {
      this.videoService.removeVideo(id);
    }
  }

  getPlaylistName(playlistId: string): string {
    const playlist = this.videoService.playlists().find(p => p.id === playlistId);
    return playlist ? playlist.name : 'Necunoscut';
  }

  /**
   * Helper pentru a extrage ID-ul unic al videoului YouTube din URL (ex: watch?v=XYZ sau youtu.be/XYZ)
   */
  private extractYoutubeId(url: string): string | null {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  }
}
