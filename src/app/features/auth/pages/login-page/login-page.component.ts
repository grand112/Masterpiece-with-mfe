import { ChangeDetectionStrategy, ChangeDetectorRef, Component } from '@angular/core';
import { Router } from '@angular/router';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Observable } from 'rxjs';
import { ILoginData } from 'src/app/models/login-data.model';
import { IUserData } from 'src/app/models/user-data.model';
import { AuthService } from 'src/app/services/auth/auth.service';

import { FirestoreService } from './../../../../services/firestore/firestore.service';
import { SnackService } from './../../../../services/snack/snack.service';

@UntilDestroy()
@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginPageComponent {
  isLoading = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private snack: SnackService,
    private firestore: FirestoreService,
    private cdr: ChangeDetectorRef,
  ) { }

  login(loginData?: ILoginData): void {
    this.isLoading = true;
    const logInMethod$ = loginData ? this.authService.login(loginData) : this.authService.loginWithGoogle();
    logInMethod$.pipe(untilDestroyed(this)).subscribe({
      next: () => !loginData ? this.setUserData().pipe(untilDestroyed(this)).subscribe(() => this.handleLogIn()) : this.handleLogIn(),
      error: (error) => {
        this.snack.openError(error.message);
        this.isLoading = false;
        this.cdr.markForCheck();
      },
    });
  }

  private setUserData(): Observable<void> {
    const userData: IUserData = {
      displayName: this.authService.getCurrentUserDisplayName(),
      email: this.authService.getCurrentUserEmail(),
      userId: this.authService.getCurrentUserId(),
    };
    return this.firestore.setDocument(`users/${userData.userId}`, userData);
  }

  private handleLogIn(): void {
    this.router.navigate(['/dashboard']);
    this.isLoading = false;
    this.cdr.markForCheck();
  }
}
