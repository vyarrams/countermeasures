import { Component } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { AnimationOptions } from 'ngx-lottie';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {

  constructor(
    private title: Title,
  ) {
    this.title.setTitle('Welcome');
  }


  options: AnimationOptions = {
    path: '../../../../assets/home/fvp.json',
  };

  register_options: AnimationOptions = {
    path: '../../../../assets/home/register.json',
  };

  pitch_options: AnimationOptions = {
    path: '../../../../assets/home/pitch.json',
  };

  meet_options: AnimationOptions = {
    path: '../../../../assets/home/meet.json',
  };

}
