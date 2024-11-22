import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { AnimationOptions } from 'ngx-lottie';
import { AuthService } from 'src/app/services/auth.service';
import { ErrorHandlerService } from 'src/app/services/error-handler.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent {

  constructor(
    private title: Title,
    private fb: FormBuilder,
    private auth: AuthService,
    private handler: ErrorHandlerService,
    private router: Router
  ) {
    this.title.setTitle('Forgot Password');
  }

  form = this.fb.group({
    email: ['', Validators.required]
  });


  onSubmit() {
    this.auth.sendPasswordResetLink(this.form.value).subscribe({
      next: (res: any) => {
        if (res) {
          this.handler.showSuccess('OTP sent to your email');
          this.router.navigate(['/reset-password', this.form.value.email]);
        } else {
          this.handler.showErrorString('Something went wrong');
        }
      },
      error: (err: any) => {
        this.handler.handleError(err);
      }
    });
  }

}
