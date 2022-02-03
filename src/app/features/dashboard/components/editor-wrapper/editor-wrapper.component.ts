import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
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
  defaultFile: File;

  private file: File;

  constructor(
    private firestorage: FirestorageService,
    private auth: AuthService,
    private firestore: FirestoreService,
    private snack: SnackService,
    private cdr: ChangeDetectorRef,
  ) { }

  ngOnInit(): void {
    this.firestorage.getFileBlob('default.jpg').pipe(untilDestroyed(this))
      .subscribe((fileBlob: Blob) => {
        this.defaultFile = new File([fileBlob], 'fileName');
        this.cdr.detectChanges();
      });
  }

  uploadFile(file: File): void {
    this.file = file;
  }

  saveFile(): void {
    const userId = this.auth.getCurrentUserId();
    const fileId = Math.random().toString(16).slice(2);
    this.firestorage.saveFile(userId, fileId, this.file);

    const documentPath = `users/${userId}/gallery/${fileId}`;
    this.firestore.setDocument(documentPath, { fileId });
  }

  handleError(errorMessage: string): void {
    this.snack.open(errorMessage);
  }
}
