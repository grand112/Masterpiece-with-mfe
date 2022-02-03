import { Component } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { AuthService } from 'src/app/services/auth/auth.service';

import { FirestoreService } from './../../../../services/firestore/firestore.service';

@Component({
  selector: 'app-editor-wrapper',
  templateUrl: './editor-wrapper.component.html',
  styleUrls: ['./editor-wrapper.component.scss'],
})
export class EditorWrapperComponent {
  private file: File;

  constructor(
    private storage: AngularFireStorage,
    private auth: AuthService,
    private firestore: FirestoreService,
  ) { }

  uploadFile(file: File): void {
    this.file = file;
  }

  saveFile(): void {
    const userId = this.auth.getCurrentUserId();
    const fileId = Math.random().toString(16).slice(2);
    const filePath = `${userId}/${fileId}`;
    const ref = this.storage.ref(filePath);
    ref.put(this.file);

    const documentPath = `users/${userId}/gallery/${fileId}`;
    this.firestore.setDocument(documentPath, { fileId });
  }
}
