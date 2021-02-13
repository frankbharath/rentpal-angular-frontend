import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, Subject } from 'rxjs';
import { map } from 'rxjs/operators';
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
    return this.httpClient.get(`${this.baseURL}/api/properties`, {params: {...parameters}, observe: 'response'}).
    pipe(
        map(data=>{
        if(data.headers.get('X-Total-Count')){
          this._totalPropertyCount.next(Number(data.headers.get('X-Total-Count')));
        }
        return <Property[]>data.body;
      })
    );
  }

  getTotalPropertyCount():Observable<number>{
    return this._totalPropertyCount.asObservable();
  }

  saveProperty(property:Property):Promise<Property>{
    return this.httpClient.post<Property>(`${this.baseURL}/api/properties`, {...property}).toPromise();
  }

  updateProperty(property:Property):Promise<Property>{
    return this.httpClient.put<Property>(`${this.baseURL}/api/properties/${property.id}`, {...property}).toPromise();
  }

  getProperty(id:number):Observable<Property>{
    return this.httpClient.get<Property>(`${this.baseURL}/api/properties/${id}`);
  }

  deleteProperties(ids:Array<number>):Promise<HttpResponse<Object>>{
    return this.httpClient.post(`${this.baseURL}/api/properties/bulkdelete?propertyIds=${ids.join(',')}`, {}, { observe: 'response' }).toPromise();
  }

  deleteProperty(id:number):Promise<Object>{
    return this.httpClient.delete(`${this.baseURL}/api/properties/${id}`, {}).toPromise();
  }
}

export interface PopertyParams{
  countRequired?:boolean;
  pageIndex?:number;
  pageSize?:number;
  searchQuery?:string;
}