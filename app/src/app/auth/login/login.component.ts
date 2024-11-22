import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { AnimationOptions } from 'ngx-lottie';
import { AuthService } from 'src/app/services/auth.service';
import { ErrorHandlerService } from 'src/app/services/error-handler.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  constructor(
    private title: Title,
    private fb: FormBuilder,
    private auth: AuthService,
    private handler: ErrorHandlerService,
    private router: Router
  ) {
    this.title.setTitle('Login');
  }


  form = this.fb.group({
    email: ['', Validators.required],
    password: ['', Validators.required]
  });


  ngOnInit(): void {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.has('user')) {
      const user = JSON.parse(urlParams.get('user') as string);
    }
  }

  onSubmit() {
    this.auth.authenticate(this.form.value).subscribe({
      next: (data: any) => {
        if (data?.user?.is_admin) {
          if (this.auth.login(data)) {
            this.router.navigate(['/admin-dashboard']);
          }
        } else {
          if (data?.user?.view_only) {
            if (this.auth.login(data)) {
              this.router.navigate(['/published-projects']);
            }
          } else {
            if (this.auth.login(data)) {
              this.router.navigate(['/dashboard']);
            }
          }
        }
      },
      error: (error: any) => {
        this.handler.handleError(error);
      }
    });
  }



}
