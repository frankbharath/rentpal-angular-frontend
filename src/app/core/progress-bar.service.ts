import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProgressBarService {

  private _isLoading: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  constructor() {}
  
  get isLoading():Observable<boolean>{
    return this._isLoading.asObservable();
  } 

  showLoading():void{
    this._isLoading.next(true);
  }
  
  hideLoading():void{
    this._isLoading.next(false);
  }
}
