import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { map, take, tap } from 'rxjs/operators';
import { Property } from '../share/models/property.model';
import { environment } from './../../environments/environment';

@Injectable({
  providedIn: 'root'
})

export class PropertyService {

  private _totalPropertyCount: BehaviorSubject<number> = new BehaviorSubject<number>(0);

  baseURL=environment.baseURL;

  constructor(private httpClient:HttpClient) {}

  getProperties(parameters?:object):Observable<Property[]>{
    return this.httpClient.get(`${this.baseURL}/properties`, {params: {...parameters}, observe: 'response'}).
    pipe(
      map(data=>{
      if(data.headers.get('X-Total-Count')){
        this._totalPropertyCount.next(Number(data.headers.get('X-Total-Count')));
      }
      return <Property[]>data.body;
    }));
  }

  getTotalPropertyCount():Observable<number>{
    return this._totalPropertyCount.asObservable();
  }

  saveProperty(property:Property):Promise<HttpResponse<Object>>{
    return this.httpClient.post(`${this.baseURL}/properties`, {...property}, { observe: 'response' }).pipe(
      tap(data=>{
        if(data.ok){
          let count=this._totalPropertyCount.value;
          this._totalPropertyCount.next(++count);
        }
      })
    ).toPromise();
  }

  deleteProperties(ids:Array<number>):Promise<HttpResponse<Object>>{
    return this.httpClient.post(`${this.baseURL}/properties/bulkdelete?propertyIds=${ids.join(',')}`, {}, { observe: 'response' }).toPromise();
  }

  deleteProperty(id:number):Promise<Object>{
    return this.httpClient.delete(`${this.baseURL}/properties/${id}`, {}).toPromise();
  }
}

export interface PopertyParams{
  countRequired?:boolean;
  pageIndex?:number;
  pageSize?:number;
  searchQuery?:string;
}