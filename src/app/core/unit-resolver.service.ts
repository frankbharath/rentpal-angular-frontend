import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { EMPTY, Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Unit } from '../share/models/unit.model';
import { Utils } from '../share/utils';
import { UnitService } from './unit.service';

@Injectable({
  providedIn: 'root'
})
export class UnitResolverService {

  constructor(
    private _unitService:UnitService,
    private _utils:Utils
  ) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot):Observable<Unit[] | Unit>{
    let unitId=route.paramMap.get("id");
    return this._unitService.getUnits(Number(unitId), {countRequired:true, pageSize:50})
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
