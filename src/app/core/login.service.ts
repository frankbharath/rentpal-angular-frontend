import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { APIService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(private readonly _httpClient:HttpClient, private readonly _apiService:APIService) {}

  login(id:'fb'|'google'){
    if(id === 'fb'){
      window.location.href=this._apiService.resolve(this._apiService.endPoints.facebookLogin);  
    }else if(id === 'google'){
      window.location.href=this._apiService.resolve(this._apiService.endPoints.googleLogin);
    }
  }

  radomLogin(){
    this._httpClient.post(this._apiService.resolve(this._apiService.endPoints.randmonLogin),{}).subscribe(()=>{
        window.location.reload();
    });
  }

  isUserLoggedIn():Promise<boolean>{
    return this._httpClient.get(this._apiService.resolve(this._apiService.endPoints.isUserLoggedIn),{observe: 'response'})
    .pipe(
      map(data=>{
        return <LoggedInStatus>data.body;
      }),
      map(data=>{
        return data.status;
      })).toPromise();
  }
  
  deleteUser(){
    this._httpClient.delete(this._apiService.resolve(this._apiService.endPoints.deleteUser)).subscribe(()=>{
      window.location.reload();
    });
  }
}

interface LoggedInStatus{
  status:boolean
}

