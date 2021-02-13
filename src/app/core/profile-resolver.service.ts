import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { User } from '../share/models/user.model';
import { ProfileService } from './profile.service';

@Injectable({
  providedIn: 'root'
})
export class ProfileResolverService implements Resolve<Promise<User>> {

  constructor(private _profileService:ProfileService) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<User> {
    return this._profileService.getUserProfile();  
  }
}
