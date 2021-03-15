import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { Unit } from '../share/models/unit.model';
import { APIService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class UnitService {
  
  private _totalUnitCount = new BehaviorSubject<number>(0);
  
  constructor(private httpClient:HttpClient, private _api:APIService) {}

  getUnits(id:number, parameters?:object):Observable<Unit[]>{
    return this.httpClient.get(this._api.resolve(this._api.endPoints.getUnits, {id:id}), {params: {...parameters}, observe: 'response'})
    .pipe(
      map(data=>{
        if(data.headers.get('X-Total-Count')){
          this._totalUnitCount.next(Number(data.headers.get('X-Total-Count')));
        }
        return <Unit[]> data.body;
      })
    );
  }

  getTotalUnitCount():Observable<number>{
    return this._totalUnitCount.asObservable();
  }

  saveUnit(propertyId:number, unit:Unit):Promise<Unit>{
    return this.httpClient.post<Unit>(this._api.resolve(this._api.endPoints.addUnit, {id:propertyId}), {...unit}).toPromise();
  }

  updateUnit(propertyId:number, unit:Unit):Promise<Unit>{
    return this.httpClient.put<Unit>(this._api.resolve(this._api.endPoints.updateUnit, {id:propertyId, unitId:unit.id}), {...unit}).toPromise();
  }

  deleteUnit(propertyId:number, unitId:number){
    return this.httpClient.delete(this._api.resolve(this._api.endPoints.deleteUnit, {id:propertyId, unitId:unitId})).toPromise();
  }

  deleteUnits(propertyId:number, unitIds:Array<number>){
    return this.httpClient.post(`${this._api.resolve(this._api.endPoints.deleteUnits, {id:propertyId})}?unitIds=${unitIds.join(',')}`,  {}, { observe: 'response' }).toPromise();
  }
}

export interface UnitParams{
  countRequired?:boolean;
  pageIndex?:number;
  pageSize?:number;
  searchQuery?:string;
}