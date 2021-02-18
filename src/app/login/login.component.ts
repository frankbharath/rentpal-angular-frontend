import { Component, OnInit } from '@angular/core';
import { LoginService } from '../core/login.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(private _loginService:LoginService) { }

  ngOnInit(): void {
  }

  login(event:MouseEvent, id:string){
    event.stopPropagation();
    this._loginService.login(id==='fb'?'fb':'google');
  }

  radomLogin(){
    this._loginService.radomLogin();
  }
}
