import { MatTableDataSource } from "@angular/material/table";
import { BehaviorSubject } from "rxjs";
import { Property } from "../share/models/property.model";
import { PopertyParams, PropertyService } from "./property.service";

export class PropertyDataSource extends MatTableDataSource<Property>{
    private properties = new BehaviorSubject<Property[]>([]);
    
    constructor(private propertyService:PropertyService, initialData:Property[]=[]) {
        super(initialData);
        this.properties.next(initialData);
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

    updateProperty(property:Property){
        this.data=this.data.map(data=>property.id===data.id?property:data);
        this.properties.next(this.data);
    }

    addProperty(property:Property){
        this.data.push(property);
        this.properties.next(this.data);
    }
}