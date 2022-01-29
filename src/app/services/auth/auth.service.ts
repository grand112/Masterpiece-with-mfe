import {
  Auth,
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  UserCredential,
} from '@angular/fire/auth';
import { Injectable } from '@angular/core';

import { ILoginData } from 'src/app/models/login-data.model';
import { from, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private auth: Auth) { }

  login(loginData: ILoginData): Observable<UserCredential> {
    return from(signInWithEmailAndPassword(this.auth, loginData.email, loginData.password));
  }

  loginWithGoogle(): Observable<UserCredential> {
    return from(signInWithPopup(this.auth, new GoogleAuthProvider()));
  }

  register(loginData: ILoginData): Observable<UserCredential> {
    return from(createUserWithEmailAndPassword(this.auth, loginData.email, loginData.password));
  }

  logout(): Observable<void> {
    return from(signOut(this.auth));
  }

  getCurrentUserDisplayName(): string {
    return this.auth.currentUser.displayName;
  }

  getCurrentUserEmail(): string {
    return this.auth.currentUser.email;
  }
}
