import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { AuthService } from 'src/app/services/auth.service';
import { ErrorHandlerService } from 'src/app/services/error-handler.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent {

  constructor(
    private title: Title,
    private auth: AuthService,
    private service: UserService,
    private handler: ErrorHandlerService,
    private fb: FormBuilder
  ) {
    this.title.setTitle('Settings');
  }

  changePasswordForm = this.fb.group({
    old_password: ['', Validators.required],
    new_password: ['', Validators.required],
    confirm_password: ['', Validators.required]
  });

  onSubmit() { }

}
