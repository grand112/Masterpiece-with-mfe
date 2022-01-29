import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

import { FirestoreService } from './../../../../services/firestore/firestore.service';
import { SnackService } from './../../../../services/snack/snack.service';
import { ILoginData } from 'src/app/models/login-data.model';
import { AuthService } from 'src/app/services/auth/auth.service';
import { IUserData } from 'src/app/models/user-data.model';

@UntilDestroy()
@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.scss'],
})
export class LoginPageComponent {
  isLoading = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private snack: SnackService,
    private firestore: FirestoreService
  ) { }

  login(loginData?: ILoginData): void {
    this.isLoading = true;
    const logInMethod$ = loginData ? this.authService.login(loginData) : this.authService.loginWithGoogle()
    logInMethod$.pipe(untilDestroyed(this)).subscribe({
      next: () => {
        this.router.navigate(['/dashboard']),
        this.isLoading = false;
        if (!loginData) {
          this.setUserData();
        }
      },
      error: (error) => {
        this.snack.open(error.message)
        this.isLoading = false;
      }
    });
  }

  private setUserData(): void {
    const userData: IUserData = {
      displayName: this.authService.getCurrentUserDisplayName(),
      email: this.authService.getCurrentUserEmail()
    };
    this.firestore.setDocument(`users/${userData.email}`, userData);
  }
}
