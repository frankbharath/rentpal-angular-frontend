import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { environment } from './../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  private _baseURL=environment.baseURL;

  constructor(private _httpClient:HttpClient) {}

  login(id:'fb'|'google'){
    window.location.href=this._baseURL+environment.oauth[id];
  }

  radomLogin(){
    this._httpClient.post(this._baseURL+"/login",{}).subscribe(()=>{
        window.location.reload();
    });
  }

  isUserLoggedIn():Promise<boolean>{
    return this._httpClient.get(`${this._baseURL}/user/session`,{observe: 'response'})
    .pipe(
      map(data=>{
        return <LoggedInStatus>data.body;
      }),
      map(data=>{
        return data.status;
      })).toPromise();
  }
  
  deleteUser(){
    this._httpClient.delete(`${this._baseURL}/user`).subscribe(()=>{
      window.location.reload();
    });
  }
}

interface LoggedInStatus{
  status:boolean
}

