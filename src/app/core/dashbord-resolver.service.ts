import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { TenantService, TenantSummary } from './tenant.service';

@Injectable({
  providedIn: 'root'
})
export class DashbordResolverService implements Resolve<Promise<TenantSummary>> {

  constructor(private _tenantService:TenantService) { }
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<TenantSummary> {
    return this._tenantService.getTenantRentSummary();
  }
}
