import {  Component } from '@angular/core';
import { LoginService } from '../core/login.service';
import { environment } from './../../environments/environment';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.css']
})
export class NavigationComponent {
  private _baseURL=environment.baseURL;
  constructor(){}

  logout(){
    window.location.href=`${this._baseURL}/logout`;
  }
}
