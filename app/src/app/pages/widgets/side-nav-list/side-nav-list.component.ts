import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-side-nav-list',
  templateUrl: './side-nav-list.component.html',
  styleUrls: ['./side-nav-list.component.scss']
})
export class SideNavListComponent implements OnInit, OnDestroy {

  isAuth = false;
  isAuthSubscription: Subscription | undefined;
  @Output() sideNavToggled = new EventEmitter<void>();

  constructor(
    private auth: AuthService
  ) { }

  ngOnInit(): void {
    this.isAuthSubscription = this.auth.authChange.subscribe({
      next: (authStatus: any) => {
        this.isAuth = authStatus;
      }
    });
  }
  ngOnDestroy(): void {
    this.isAuthSubscription?.unsubscribe();
  }

  sidenavToggle() {
    this.sideNavToggled.emit();
  }

  onLogout() {
    this.sidenavToggle();
    this.auth.logout();
  }


}
