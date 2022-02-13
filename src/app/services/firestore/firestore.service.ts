/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { Injectable } from '@angular/core';
import { AngularFirestore, DocumentReference, DocumentSnapshot, QuerySnapshot } from '@angular/fire/compat/firestore';
import { from, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class FirestoreService {
  constructor(private firestore: AngularFirestore) { }

  addDocumentToCollection(collectionPath: string, item: object): Observable<DocumentReference<object>> {
    const collection = this.firestore.collection<object>(collectionPath);
    return from(collection.add(item));
  }

  setDocumentInCollection(collectionPath: string, docName: string, item: object): Observable<void> {
    const collection = this.firestore.collection<object>(collectionPath);
    return from(collection.doc(docName).set(item));
  }

  getCollection(collectionName: string): Observable<QuerySnapshot<any>> {
    return this.firestore.collection<any>(collectionName).get();
  }

  getOrderedCollection(collectionName: string, orderField: string, sortDirection: 'desc' | 'asc'): Observable<QuerySnapshot<any>> {
    return this.firestore.collection<any>(collectionName, ref => ref.orderBy(orderField, sortDirection)).get();
  }

  getDocument(docPath: string): Observable<DocumentSnapshot<any>> {
    return this.firestore.doc<any>(docPath).get();
  }

  deleteDocument(docPath: string): Observable<void> {
    return from(this.firestore.doc<object>(docPath).delete());
  }

  setDocument(docPath: string, item: object): Observable<void> {
    const document = this.firestore.doc<object>(docPath);
    return from(document.set(item));
  }

  updateDocument(docPath: string, item: object): Observable<void> {
    const document = this.firestore.doc<object>(docPath);
    return from(document.update(item));
  }
}
