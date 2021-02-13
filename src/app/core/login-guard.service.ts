import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable, of } from 'rxjs';
import { LoginService } from './login.service';

@Injectable({
  providedIn: 'root'
})

export class LoginGuardService implements CanActivate {

  constructor(private _loginService:LoginService, private _router:Router) { }
    
    async canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot):Promise<boolean> {
      let response = await this._loginService.isUserLoggedIn();
      if(response){
        this._router.navigate([""]);
        return false;
      }
      return true;
    }
}
