import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot } from '@angular/router';
import { EMPTY, Observable } from 'rxjs';
import { Property } from '../share/models/property.model';
import { PropertyService } from './property.service';
import { catchError } from 'rxjs/operators';
import { Utils } from '../share/utils';

@Injectable({
  providedIn: 'root'
})
export class PropertyResolverService implements Resolve<Observable<Property[] | Property>>{

  constructor(
    private propertyService:PropertyService, 
    private _utils: Utils) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot):Observable<Property[] | Property> {
    if(route.routeConfig?.path==="properties"){
      const propertyParams=sessionStorage.getItem("propertyParams");
      if(propertyParams && route.paramMap.get("state")){
        return this.propertyService.getProperties({...JSON.parse(propertyParams), countRequired:true});
      }else{
        sessionStorage.removeItem("propertyParams");
        return this.propertyService.getProperties({countRequired:true, pageSize:50});
      }
    }else{
      let propertyId=route.paramMap.get("id");
      return this.propertyService.getProperty(Number(propertyId))
      .pipe(
        catchError(response=>{
          if(response.status===400){
            this._utils.showMessage(response.error.message, true);
          }else{
            this._utils.showMessage("Unable to process you request", true);
          }
          return EMPTY;
        })
      );
    }
  }
}
