import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { User } from '../share/models/user.model';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {

  baseURL=environment.baseURL;

  constructor(private _httpClient:HttpClient) {}

  getUserProfile():Promise<User>{
    return this._httpClient.get<User>(`${this.baseURL}/user`).toPromise();
  }
}
