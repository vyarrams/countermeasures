import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProfileRouterSharedService {

  constructor() { }

  // profile  as BehaviorSubject
  profile = new BehaviorSubject<any>(null);

  setProfile(profile: any) {
    this.profile.next(profile);
  }

  getProfile() {
    return this.profile.asObservable();
  }
}
