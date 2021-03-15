import { MatTableDataSource } from "@angular/material/table";
import { BehaviorSubject } from "rxjs";
import { Property } from "../share/models/property.model";


export class PropertyDataSource extends MatTableDataSource<Property>{
    private readonly properties$ = new BehaviorSubject<Property[]>([]);
    
    constructor(initialData:Property[]=[]) {
        super(initialData);
        this.loadProperties(initialData);
    }
    
    connect(): BehaviorSubject<Property[]> {
       return this.properties$;
    }

    disconnect(): void {
        this.properties$.unsubscribe();
    }
    
    loadProperties(properties:Property[]){
        this.properties$.next(properties);
        this.data=properties;
    }

    updateProperty(property:Property){
        this.data=this.data.map(data=>property.id===data.id?property:data);
        this.properties$.next(this.data);
    }

    addProperty(property:Property){
        this.data.push(property);
        this.properties$.next(this.data);
    }
}