import { Injectable } from '@angular/core';
import { AngularFirestore, DocumentReference } from '@angular/fire/compat/firestore';
import { from, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FirestoreService {
  constructor(private firestore: AngularFirestore) { }

  addDocumentToCollection(collectionName: string, item: any): Observable<DocumentReference<any>> {
    const collection = this.firestore.collection<any>(collectionName);
    return from(collection.add(item));
  }

  setDocument(docPath: string, item: any): Observable<void> {
    const document = this.firestore.doc<any>(docPath);
    return from(document.set(item));
  }
}
