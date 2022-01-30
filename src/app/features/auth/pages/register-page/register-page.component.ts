import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Router } from '@angular/router';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

import { FirestoreService } from './../../../../services/firestore/firestore.service';
import { SnackService } from './../../../../services/snack/snack.service';
import { switchMap } from 'rxjs';
import { ILoginData } from 'src/app/models/login-data.model';
import { AuthService } from 'src/app/services/auth/auth.service';
import { IUserData } from 'src/app/models/user-data.model';

@UntilDestroy()
@Component({
  selector: 'app-register-page',
  templateUrl: './register-page.component.html',
  styleUrls: ['./register-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegisterPageComponent {
  isLoading = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private snack: SnackService,
    private firestore: FirestoreService
  ) { }

  register(loginData: ILoginData): void {
    this.isLoading = true;
    this.authService.register(loginData).pipe(switchMap(() =>
    this.authService.login(loginData))).pipe(untilDestroyed(this)).
    subscribe({
      next: () => {
        this.router.navigate(['/dashboard']),
        this.isLoading = false;
        this.setUserData(loginData);
      },
      error: (error) => {
        this.snack.open(error.message)
        this.isLoading = false;
      }
    });
  }

  private setUserData(loginData: ILoginData): void {
    const userData: IUserData = {
      displayName: loginData.userName,
      email: loginData.email
    };
    this.firestore.setDocument(`users/${userData.email}`, userData);
  }
}
