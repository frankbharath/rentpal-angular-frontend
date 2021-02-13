import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { Tenant } from '../share/models/tenant.model';
import { TenantService } from './tenant.service';

@Injectable({
  providedIn: 'root'
})
export class TenantResolverService implements Resolve<Observable<Tenant[]>>{

  constructor(
    private _tenantService:TenantService
  ) { }
  
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Tenant[]> {
    return this._tenantService.getTenants({countRequired:true, pageSize:50});
  }
}
