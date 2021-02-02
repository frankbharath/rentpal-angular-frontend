import { MatTableDataSource } from "@angular/material/table";
import { BehaviorSubject, Observable } from "rxjs";
import { Property } from "../share/models/property.model";
import { PopertyParams, PropertyService } from "./property.service";

export class PropertyDataSource extends MatTableDataSource<Property>{
    private properties = new BehaviorSubject<Property[]>([]);

    private updatePropertyObservable:any;
    
    constructor(private propertyService:PropertyService, private initialData:Property[]=[]) {
        super(initialData);
        this.properties.next(this.initialData);
        this.updatePropertyObservable = this.propertyService.updatePropertyObservable().subscribe(updatedProperty=>{
            this.data=this.data.map(property=>property.id===updatedProperty.id?updatedProperty:property);
            this.properties.next(this.data);
        });
    }
    
    connect(): BehaviorSubject<Property[]> {
       return this.properties;
    }

    disconnect(): void {
        this.properties.unsubscribe();
        //this.updatePropertyObservable.unsubscribe();
    }
    
    loadProperties(params?:PopertyParams){
        return this.propertyService.getProperties(params).subscribe(data=>{
            this.properties.next(data);
            this.data=data;
        });
    }
}