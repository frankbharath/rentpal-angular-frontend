import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Property } from '../share/models/property.model';
import { APIService } from './api.service';

@Injectable({
  providedIn: 'root'
})

export class PropertyService {

  private readonly _totalPropertyCount: BehaviorSubject<number> = new BehaviorSubject<number>(0);

  constructor(private readonly httpClient:HttpClient, private readonly _api:APIService) {}

  getProperties(parameters?:object):Observable<Property[]>{
    return this.httpClient.get(this._api.resolve(this._api.endPoints.getProperties), {params: {...parameters}, observe: 'response'}).
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
    return this.httpClient.post<Property>(this._api.resolve(this._api.endPoints.addProperty), {...property}).toPromise();
  }

  updateProperty(property:Property):Promise<Property>{
    return this.httpClient.put<Property>(this._api.resolve(this._api.endPoints.updateProperty, {id:property.id}), {...property}).toPromise();
  }

  getProperty(id:number):Observable<Property>{
    return this.httpClient.get<Property>(this._api.resolve(this._api.endPoints.getProperty, {id:id}));
  }

  deleteProperties(ids:Array<number>):Promise<HttpResponse<Object>>{
    return this.httpClient.post(`${this._api.resolve(this._api.endPoints.deleteProperties)}?propertyIds=${ids.join(',')}`, {}, { observe: 'response' }).toPromise();
  }

  deleteProperty(id:number):Promise<HttpResponse<Object>>{
    return this.httpClient.delete(this._api.resolve(this._api.endPoints.deleteProperty, {id:id}), { observe: 'response' }).toPromise();
  }
}

export interface PropertyParams{
  countRequired?:boolean;
  pageIndex?:number;
  pageSize?:number;
  searchQuery?:string;
}