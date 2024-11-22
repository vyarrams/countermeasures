import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AnimationOptions } from 'ngx-lottie';

@Component({
  selector: 'app-empty',
  templateUrl: './empty.component.html',
  styleUrls: ['./empty.component.scss']
})
export class EmptyComponent implements OnInit {

  @Input() context: string = '';
  message: string = '';
  route: string = '';
  button_text: string = '';

  constructor(
    private router: Router
  ) { }

  ngOnInit(): void {
    switch (this.context) {
      case 'pitches':
        this.message = 'No pitches found';
        this.button_text = 'Add Pitch';
        break;
      case 'startups':
        this.message = 'No startups found';
        this.button_text = 'Add Startup';
        break;
      case 'saved_pitches':
        this.message = 'You have no saved pitches';
        this.button_text = 'Explore Pitches';
        break;
      case 'applications':
        this.message = 'You have not applied for any pitches yet';
        this.button_text = 'Explore Pitches';
        break;
      case 'received-applications':
        this.message = 'You have not received any applications yet';
        this.button_text = 'Add Pitch';
        break;
      case 'inbox':
        this.message = 'You have no messages';
        this.button_text = 'Start a conversation';
        break;
    }
  }

  options: AnimationOptions = {
    path: '../../../../assets/animations/empty.json',
  };

  btnClicked() {
    switch (this.context) {
      case 'pitches':
        this.router.navigate(['/dashboard']);
        break;
      case 'startups':
        this.router.navigate(['/create-startup']);
        break;
      case 'saved_pitches':
        this.router.navigate(['/dashboard']);
        break;
      case 'applications':
        this.router.navigate(['/dashboard']);
        break;
      case 'received-applications':
        this.router.navigate(['/dashboard']);
        break;
      case 'inbox':
        this.router.navigate(['/dashboard']);
        break;
      default:
        this.router.navigate(['/dashboard']);
        break;
    }
  }
}
