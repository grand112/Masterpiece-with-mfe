import { Injectable } from '@angular/core';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root',
})
export class SnackService {
  private readonly snackConfig = {
    horizontalPosition: 'center' as MatSnackBarHorizontalPosition,
    verticalPosition: 'top' as MatSnackBarVerticalPosition,
    duration: 3000,
    panelClass: ['snackbar'],
  };

  constructor(private snackBar: MatSnackBar) { }

  open(message: string): void {
    this.snackBar.open(message, '', this.snackConfig );
  }

  openError(message: string): void {
    this.snackBar.open(this.formatMessage(message), '', this.snackConfig);
  }

  private formatMessage(message: string): string {
    if (message.includes('invalid-email')) {
      return 'Podano nieprawidłowy adres email';
    } else if (message.includes('weak-password')) {
      return 'Hasło powinno zawierać przynajmniej 6 znaków';
    } else if (message.includes('user-not-found')) {
      return 'Nie znaleziono konta dla podanego adresu Email';
    } else if (message.includes('wrong-password')) {
      return 'Niepoprawne hasło';
    } else if (message.includes('email-already-in-use')) {
      return 'Konto z podanym adresem Email już istnieje';
    } else {
      return 'Wystąpił błąd. Spróbuj ponownie';
    }
  }
}
