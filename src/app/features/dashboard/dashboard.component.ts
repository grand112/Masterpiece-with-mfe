import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

import { AuthService } from 'src/app/services/auth/auth.service';

@UntilDestroy()
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent {
  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  logout() {
    this.authService.logout().pipe(untilDestroyed(this)).subscribe(() => this.router.navigate(['/']));
  }
}
