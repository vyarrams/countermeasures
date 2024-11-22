import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, BehaviorSubject } from "rxjs";
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  authChange = new BehaviorSubject<boolean>(localStorage.getItem('tk') ? true : false);

  isAuthenticated: boolean = localStorage.getItem('tk') ? true : false;

  tips = [
    {
      title: 'You can add your startup profile!',
      description: 'You can add your startup profile and get more visibility to your startup. It is also a great way to get more users and customers. It is constantly being improved to make it easier for your potential customers to find you.',
    },
    {
      title: 'Make your pitch as clear as possible',
      description: 'For every pitch you post, you can create a startup profile so you can go into details about your startup. Your pitch should be concise and to the point. It should be easy to understand and should be able to convey your idea and vision to the potential teammates & investors. ELI5 (Explain Like I\'m 5) is a good rule of thumb.',
    },
    {
      title: 'You can add your skills to your profile!',
      description: 'You can add your skills to your profile so that other users can find you easily. You can also add your skills to your startup profile so that potential teammates can find you easily.',
    },
    {
      title: 'You can subscribe to pitches with specific hashtags',
      description: 'You have a separate section where you can see all the pitches from the tags that you have subscribed to. In addition, you will also receive a weekly email with the pitches from the tags that you have subscribed to. You can change this in your profile settings.',
    },
    {
      title: 'You can subscribe to pitches in specific stages',
      description: 'Only interested in pitches what have at least an MVP? You can subscribe to pitches in specific stages. You have a separate section where you can see all the pitches from the stages that you have subscribed to. In addition, you will also receive a weekly email with the pitches from the stages that you have subscribed to. You can change this in your profile settings.',
    },
    {
      title: 'Follow your favorite startups',
      description: 'You can follow your favorite startups and get notified when they post anything new. In addition, discussions from the startups that you follow will be shown in your feed. (Currently in development)',
    },
    {
      title: 'You can add tech stacks to your startup profile',
      description: 'You can add tech stacks to your startup profile so that potential teammates can find you easily.',
    },
    {
      title: 'With pro membership, you can post unlimited pitches',
      description: 'With pro membership, you can post unlimited pitches. In addition, you can customize your newsletter and have access to stats about your profile, pitches and startup profile.',
    },
    {
      title: 'You can make yourself available for hire',
      description: 'Looking for a job? You can make yourself available for hire so that potential employers can find you easily. You can also add your skills to your profile to make it easy to find you.',
    },
  ];

  constructor(
    private http: HttpClient,
    private router: Router,
  ) { }

  getRandTip() {
    return this.tips[Math.floor(Math.random() * this.tips.length)];
  }

  // Login
  authenticate(user: any): Observable<any> {
    return this.http.post(`${environment.api}authenticate`, user, { observe: 'body' });
  }

  // Register
  register(user: any): Observable<any> {
    return this.http.post(`${environment.api}register`, user, { observe: 'body' });
  }
  // Change password
  changePassword(data: any): Observable<any> {
    return this.http.post(`${environment.api}change-password`, data, { observe: 'body' });
  }

  // Send password reset link
  sendPasswordResetLink(data: any): Observable<any> {
    return this.http.post(`${environment.api}send-password-reset-link`, data, { observe: 'body' });
  }

  // Reset password
  resetPassword(data: any): Observable<any> {
    return this.http.post(`${environment.api}reset-password`, data, { observe: 'body' });
  }

  // ** Login **
  login(data: any): boolean {
    this.storeUserData(data)
    this.isAuthenticated = true;
    this.authChange.next(true);
    return true;
  }
  isLoggedIn(): boolean {
    return this.isAuthenticated;
  }
  storeUserData(data: any) {
    localStorage.setItem('user', JSON.stringify(data.user));
    localStorage.setItem('tk', data.token);
  }

  getToken() {
    return localStorage.getItem('tk');
  }

  getStoredUser() {
    if (localStorage.getItem('user')) {
      return JSON.parse(localStorage.getItem('user') || '{}');
    }
    return null;
  }


  logout() {
    localStorage.clear();
    this.authChange.next(false);
    this.router.navigate(['/']);
    this.isAuthenticated = false;
  }
}
