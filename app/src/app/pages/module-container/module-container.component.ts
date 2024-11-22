import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AuthService } from 'src/app/services/auth.service';
import { ErrorHandlerService } from 'src/app/services/error-handler.service';
import { UserService } from 'src/app/services/user.service';
import { LogoutConfirmationComponent } from '../widgets/logout-confirmation/logout-confirmation.component';


// takeUntil
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-module-container',
  templateUrl: './module-container.component.html',
  styleUrls: ['./module-container.component.scss']
})
export class ModuleContainerComponent implements OnInit, OnDestroy {

  user: any;
  unread_applications: number = 0;
  destroy$: Subject<boolean> = new Subject<boolean>();

  constructor(
    private auth: AuthService,
    private handler: ErrorHandlerService,
    private dialog: MatDialog,
    private service: UserService
  ) {
  }

  user_numbers: { followers: number, pitches: number, startups: number } | undefined;

  ngOnInit(): void {
    this.user = this.auth.getStoredUser();
  }

  logout() {
    this.dialog.open(LogoutConfirmationComponent).afterClosed()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (result) => {
          if (result) {
            this.auth.logout();
          }
        }
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }



}
