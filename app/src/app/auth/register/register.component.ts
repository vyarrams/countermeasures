import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { AnimationOptions } from 'ngx-lottie';
import { AuthService } from 'src/app/services/auth.service';
import { ErrorHandlerService } from 'src/app/services/error-handler.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {

  constructor(
    private title: Title,
    private fb: FormBuilder,
    private auth: AuthService,
    private handler: ErrorHandlerService,
    private router: Router
  ) {
    this.title.setTitle('Register');
  }



  options: AnimationOptions = {
    path: '../../../../assets/auth/team.json',
  };


  form = this.fb.group({
    first_name: ['', Validators.required],
    last_name: ['', Validators.required],
    email: ['', Validators.required],
    password: ['', Validators.required],
  });

  onSubmit() {
    this.auth.register(this.form.value).subscribe({
      next: (data: any) => {
        if (this.auth.login(data)) {
          this.router.navigate(['/your-profile', , { from: 'auth' }]);
        }
      },
      error: (error: any) => {
        this.handler.handleError(error);
      }
    });
  }



}
