import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { Property } from '../share/models/property.model';
import { PropertyService } from './property.service';

@Injectable({
  providedIn: 'root'
})
export class PropertyResolverService implements Resolve<Observable<Property[]>>{

  constructor(private propertyService:PropertyService) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot):Observable<Property[]> {
    return this.propertyService.getProperties({countRequired:true});
  }
}
