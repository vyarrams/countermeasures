import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class ErrorHandlerService {

  constructor(
    private snackBar: MatSnackBar,
    private auth: AuthService
  ) { }

  showSuccess(message: string): void {
    this.snackBar.open(message, undefined, { duration: 1000 });
  }

  showErrorString(message: string): void {
    this.snackBar.open(message, undefined, { duration: 1000 });
  }

  handleError(error: any): void {
    // error status code
    console.log(error.status);
    if (error.status === 401) {
      this.auth.logout();
    }

    if (typeof error.error === 'string') {
      this.showErrorString(error.error);
    } else if (typeof error.error.message === 'string') {
      this.showErrorString(error.error.message);
    } else {
      const e = error.error;
      switch (e.code) {
        case 11000:
          Object.keys(e.keyValue).forEach(key => {
            // Key to title case
            const _key = key.replace(/_/g, ' ').replace(/\w\S*/g, (w) => (w.replace(/^\w/, (c) => c.toUpperCase())));
            this.snackBar.open(`${_key} already exists`, undefined, { duration: 2000 });
          });
          // this.snackBar.open('Duplicate key', undefined, { duration: 1000 });
          break;
        default:
          this.snackBar.open('Something went wrong', undefined, { duration: 2000 });
          break;
      }

    }
  }
}
