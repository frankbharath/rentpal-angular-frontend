import { MatTableDataSource } from "@angular/material/table";
import { BehaviorSubject, Observable } from "rxjs";
import { Property } from "../share/models/property.model";
import { PopertyParams, PropertyService } from "./property.service";

export class PropertyDataSource extends MatTableDataSource<Property>{
    private properties = new BehaviorSubject<Property[]>([]);

    constructor(private propertyService:PropertyService, private initialData:Property[]=[]) {
        super(initialData);
        this.properties.next(this.initialData);
    }
    
    connect(): BehaviorSubject<Property[]> {
       return this.properties;
    }

    disconnect(): void {
        this.properties.unsubscribe();
    }
    
    loadProperties(params?:PopertyParams){
        return this.propertyService.getProperties(params).subscribe(data=>{
            this.properties.next(data);
            this.data=data;
        });
    }
}