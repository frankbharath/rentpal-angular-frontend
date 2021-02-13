import { MatTableDataSource } from "@angular/material/table"
import { BehaviorSubject, Observable } from "rxjs"
import { Unit } from "../share/models/unit.model"
import { UnitParams, UnitService } from "./unit.service";

export class UnitDataSource extends MatTableDataSource<Unit>{

    private _units = new BehaviorSubject<Unit[]>([]);

    constructor(
        private _unitService:UnitService,
        private initialData:Unit[]=[]
    ){
        super(initialData);
        this._units.next(initialData);
        
    }

    connect(): BehaviorSubject<Unit[]>{
        return this._units;
    }

    disconnect():void {
        this._units.unsubscribe();
    }

    loadUnits(id:number, params?:UnitParams){
        return this._unitService.getUnits(id, params).subscribe(data=>{
            this._units.next(data);
            this.data=data;
        });
    }

    totalUnits():Observable<number>{
        return this._unitService.getTotalUnitCount();
    }

    updateUnit(unit:Unit){
        this.data=this.data.map(data=>data.id===unit.id?unit:data);
        this._units.next(this.data);
    }

    addUnit(unit:Unit){
        this.data.push(unit);
        this._units.next(this.data);
    }

}