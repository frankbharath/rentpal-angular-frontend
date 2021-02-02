import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, Subject } from 'rxjs';
import { map, take, tap } from 'rxjs/operators';
import { Property } from '../share/models/property.model';
import { environment } from './../../environments/environment';

@Injectable({
  providedIn: 'root'
})

export class PropertyService {

  private _totalPropertyCount: BehaviorSubject<number> = new BehaviorSubject<number>(0);

  private _updatedProperty: Subject<Property> = new Subject<Property>();

  private _properties:Property[]=[];

  baseURL=environment.baseURL;

  constructor(private httpClient:HttpClient) {}

  getProperties(parameters?:object):Observable<Property[]>{
    return this.httpClient.get(`${this.baseURL}/properties`, {params: {...parameters}, observe: 'response'}).
    pipe(
      map(data=>{
      if(data.headers.get('X-Total-Count')){
        this._totalPropertyCount.next(Number(data.headers.get('X-Total-Count')));
      }
      this._properties=<Property[]>data.body;
      return this._properties;
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

  updateProperty(property:Property):Promise<HttpResponse<Object>>{
    return this.httpClient.put(`${this.baseURL}/properties/${property.id}`, {...property}, { observe: 'response' }).pipe(
      tap(data=>{
        if(data.ok){
          let updatedProperty=<Property>data.body;
          this._properties=this._properties.map(property=>property.id===updatedProperty.id?updatedProperty:property);
          this._updatedProperty.next(updatedProperty);
        }
      })
    ).toPromise();
  }

  updatePropertyObservable():Observable<Property>{
    return this._updatedProperty.asObservable();
  }

  getProperty(id:number):Observable<Property>{
    return this.httpClient.get<Property>(`${this.baseURL}/properties/${id}`);
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