/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { HttpClient } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { NgxImageCompressService } from 'ngx-image-compress';
import { from, map, Observable } from 'rxjs';
import { AuthService } from 'src/app/services/auth/auth.service';
import { FirestorageService } from 'src/app/services/firestorage/firestorage.service';
import { SnackService } from 'src/app/services/snack/snack.service';

import { FirestoreService } from './../../../../services/firestore/firestore.service';

@UntilDestroy()
@Component({
  selector: 'app-editor-wrapper',
  templateUrl: './editor-wrapper.component.html',
  styleUrls: ['./editor-wrapper.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EditorWrapperComponent implements OnInit {
  defaultFile$: Observable<File>;
  fileToOpen$: Observable<File>;
  userId: string;
  fileNameFromRoute: string;

  constructor(
    private firestorage: FirestorageService,
    private auth: AuthService,
    private firestore: FirestoreService,
    private snack: SnackService,
    private http: HttpClient,
    private route: ActivatedRoute,
    private imageCompress: NgxImageCompressService,
  ) { }

  ngOnInit(): void {
    this.fileNameFromRoute = this.route.snapshot.paramMap.get('id');
    this.userId = this.auth.getCurrentUserId();
    this.getFileFromRoute();
    this.defaultFile$ = this.getDefaultFile();
  }

  saveFile(fileEvent: any): void {
    let documentPath: string;
    let fileId: string;
    if (this.fileNameFromRoute) {
      fileId = this.fileNameFromRoute;
      documentPath = `users/${this.userId}/gallery/${this.fileNameFromRoute}`;
    } else {
      fileId = Math.random().toString(16).slice(2);
      documentPath = `users/${this.userId}/gallery/${fileId}`;
    }
    from(this.imageCompress.compressFile(fileEvent.detail, -2)).
      pipe(untilDestroyed(this)).subscribe(dataUrl => {
        const blob = this.dataUrlToBlob(dataUrl);
        const file = new File([blob], 'fileName');
        this.firestorage.saveFile(this.userId, fileId, file);
        this.firestore.setDocument(documentPath, { fileId, date: new Date().toUTCString() });
      });
  }

  handleMessage(messageEvent: any): void {
    this.snack.open(messageEvent.detail);
  }

  private dataUrlToBlob(dataUrl: string): Blob {
    const { groups: { mime, base64data } } = /data:(?<mime>.+);base64,(?<base64data>.+)/.exec(dataUrl);

    const byteCharacters = atob(base64data);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    return new Blob([byteArray], { type: mime });
  }

  private getDefaultFile(): Observable<File> {
    return this.http.get('assets/default.jpg', { responseType: 'blob' }).
      pipe(map(defaultBlob => new File([defaultBlob], 'fileName')));
  }

  private getFileFromRoute(): void {
    if (this.fileNameFromRoute) {
      this.fileToOpen$ = this.firestorage.getFileBlob(`${this.userId}/${this.fileNameFromRoute}`).
        pipe(map(fileBlob => new File([fileBlob], 'fileName')));
    }
  }
}
