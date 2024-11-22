import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { AnimationOptions } from 'ngx-lottie';
import { AuthService } from 'src/app/services/auth.service';
import { ErrorHandlerService } from 'src/app/services/error-handler.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent implements OnInit {

  constructor(
    private title: Title,
    private fb: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private auth: AuthService,
    private handler: ErrorHandlerService,
    private router: Router
  ) {
    this.title.setTitle('Reset Password');
  }

  email: string = '';

  form = this.fb.group({
    otp: ['', Validators.required],
    password: ['', Validators.required],
    confirm_password: ['', Validators.required],
    email: ['', Validators.required],
  });

  options: AnimationOptions = {
    path: '../../../../assets/auth/team.json',
  };

  tip: any;

  ngOnInit(): void {
    this.tip = this.auth.getRandTip();
    this.activatedRoute.params.subscribe(params => {
      this.email = params['email'];
      this.form.patchValue({ email: this.email });
    });
  }

  onSubmit() {
    if (this.form.value.password !== this.form.value.confirm_password) {
      this.handler.showErrorString('Password and confirm password must be same');
      return;
    }
    this.auth.resetPassword(this.form.value).subscribe({
      next: (res: any) => {
        if (res) {
          this.handler.showSuccess('Password reset successfully');
          this.router.navigate(['/login']);
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
