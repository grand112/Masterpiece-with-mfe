import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { ListResult } from 'firebase/storage';
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class FirestorageService {
  constructor(
    private storage: AngularFireStorage,
    private http: HttpClient,
  ) { }

  saveFile(userId: string, fileId: string, file: File): void {
    const filePath = `${userId}/${fileId}`;
    const ref = this.storage.ref(filePath);
    ref.put(file, { contentType: 'image/jpeg' });
  }

  getFileBlob(filePath: string): Observable<Blob> {
    return this.getFileUrl(filePath).pipe(switchMap((fileUrl: string) =>
      this.http.get(fileUrl, { responseType: 'blob' })));
  }

  getStorageFolder(folderPath: string): Observable<ListResult> {
    return this.storage.ref(folderPath).listAll();
  }

  getFileUrl(filePath: string): Observable<string> {
    return this.storage.ref(filePath).getDownloadURL();
  }

  deleteFile(filePath: string): Observable<any> {
    return this.storage.ref(filePath).delete();
  }
}
