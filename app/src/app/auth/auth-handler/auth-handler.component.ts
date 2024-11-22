import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-auth-handler',
  templateUrl: './auth-handler.component.html',
  styleUrls: ['./auth-handler.component.scss']
})
export class AuthHandlerComponent implements OnInit {

  constructor(
    private auth: AuthService,
    private router: Router,
    private service: UserService,
    private activatedRoute: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe(params => {
      const user = JSON.parse(params['user']);
      const token = params['token'];
      const data = {
        user: user,
        token: token
      }
      if (this.auth.login(data)) {
        this.router.navigate(['/dashboard']);
      }

    });
  }

}
