import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { Tenant } from '../share/models/tenant.model';
import { APIService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class TenantService {

  private _totalTenantCount: BehaviorSubject<number> = new BehaviorSubject<number>(0);

  constructor(private httpClient:HttpClient, private _api:APIService) {}

  getTenants(parameters?:object):Observable<Tenant[]>{
    return this.httpClient.get(this._api.resolve(this._api.endPoints.tenant), {params: {...parameters}, observe: 'response'})
    .pipe(
      map(data=>{
        if(data.headers.get('X-Total-Count')){
          this._totalTenantCount.next(Number(data.headers.get('X-Total-Count')));
        }
        return <Tenant[]>data.body;
      })
    );
  }

  saveTenant(tenant:Tenant){
    return this.httpClient.post<Tenant>(this._api.resolve(this._api.endPoints.tenant), {...tenant}).toPromise();
  }

  deleteTenants(id:number):Promise<Object>{
    return this.httpClient.delete(this._api.resolve(this._api.endPoints.tenantDelete, {id:id}), {}).toPromise();
  }

  getTenantRentSummary():Promise<TenantSummary>{
    return this.httpClient.get<TenantSummary>(this._api.resolve(this._api.endPoints.tenantSummary)).toPromise();
  }

  get totalTenantCount(){
    return this._totalTenantCount;
  }
}

export interface TenantParams{
  countRequired?:boolean;
  pageIndex?:number;
  pageSize?:number;
}

export interface TenantSummary{
  monthSummary?:Array<MonthSummary>;
  propertySummary?:Array<PropertySummary>;
  upcomingPayments?:Array<UpcomingPayment>;
}

export interface MonthSummary{
  month?:string;
  rent?:number;
}
export interface PropertySummary{
  totalRent:number;
  propertyName:String;
  propertyId:number;
}

export interface UpcomingPayment{
  firstName:string;
  lastName:string;
  email:string;
  nextPayment:string;
}
