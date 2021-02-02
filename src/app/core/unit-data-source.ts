import { Injectable } from "@angular/core";
import { MatTableDataSource } from "@angular/material/table"
import { BehaviorSubject, Observable } from "rxjs"
import { Unit } from "../share/models/unit.model"
import { UnitParams, UnitService } from "./unit.service";

@Injectable({
    providedIn: 'root'
  })
  
export class UnitDataSource extends MatTableDataSource<Unit>{

    private _units = new BehaviorSubject<Unit[]>([]);

    constructor(
        private _unitService:UnitService
    ){
        super([]);
    }

    connect(): BehaviorSubject<Unit[]>{
        return this._units;
    }

    disconnect():void {
        //this._units.unsubscribe();
    }

    loadUnits(id:number, params?:UnitParams){
        return this._unitService.getUnits(id, params).subscribe(data=>{
            this.loadUnitsWithArray(data);
        });
    }

    loadUnitsWithArray(units:Unit[]){
        this._units.next(units);
        this.data=units;
    }

    totalUnits():Observable<number>{
        return this._unitService.getTotalUnitCount();
      }

}