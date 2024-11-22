import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AuthService } from 'src/app/services/auth.service';
import { LogoutConfirmationComponent } from '../logout-confirmation/logout-confirmation.component';

@Component({
  selector: 'app-auth-navbar',
  templateUrl: './auth-navbar.component.html',
  styleUrls: ['./auth-navbar.component.scss']
})
export class AuthNavbarComponent {

  constructor(
    private auth: AuthService,
    private dialog: MatDialog
  ) { }

  logout() {
    this.dialog.open(LogoutConfirmationComponent).afterClosed().subscribe({
      next: (result) => {
        if (result) {
          this.auth.logout();
        }
      }
    });
  }

}

