import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Tenant } from '../share/models/tenant.model';

@Injectable({
  providedIn: 'root'
})
export class TenantService {

  private _totalTenantCount: BehaviorSubject<number> = new BehaviorSubject<number>(0);

  baseURL=environment.baseURL;

  constructor(private httpClient:HttpClient) {}

  getTenants(parameters?:object):Observable<Tenant[]>{
    return this.httpClient.get(`${this.baseURL}/api/tenants`, {params: {...parameters}, observe: 'response'})
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
    return this.httpClient.post<Tenant>(`${this.baseURL}/api/tenants`, {...tenant}).toPromise();
  }

  deleteTenants(id:number):Promise<Object>{
    return this.httpClient.delete(`${this.baseURL}/api/tenants/${id}`, {}).toPromise();
  }

  getTenantRentSummary():Promise<TenantSummary>{
    return this.httpClient.get<TenantSummary>(`${this.baseURL}/api/tenants/summary/rent`).toPromise();
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
