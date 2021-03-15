import { Inject } from '@angular/core';
import { Injectable, InjectionToken } from '@angular/core';
import { environment } from 'src/environments/environment';
import { TenantAPIEndPoint } from '../tenant/tenant-api-interface';
import { PropertyAPIEndPoint} from '../property/property-api-interface';
import { UnitAPIEndPoint } from '../property/unit/unit-api-interface';
import { AuthAPIEndPoint } from '../login/auth-api-interface';

export const END_POINTS = new InjectionToken('END_POINTS');

@Injectable({
  providedIn: 'root'
})
export class APIService {

  private readonly _baseURL=environment.baseURL;
  public readonly endPoints:TenantAPIEndPoint & PropertyAPIEndPoint & UnitAPIEndPoint & AuthAPIEndPoint;

  constructor(@Inject(END_POINTS) private _endPoints:Array<object>) {
    this.endPoints = this._endPoints.reduce((acc, current) => {
      return {...acc, ...current};
    }, {} as any);
  }

  resolve(url:string, params:{[key:string]:any}={}){
    return `${this._baseURL}${Object.keys(params).reduce((acc, param)=>{
      return acc.replace(`:${param}`, params[param])
    }, url)}`;
  }

}
