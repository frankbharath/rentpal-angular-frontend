import { MatTableDataSource } from "@angular/material/table";
import { BehaviorSubject } from "rxjs";
import { Tenant } from "../share/models/tenant.model";
import { TenantParams, TenantService } from "./tenant.service";

export class TenantDataSource extends MatTableDataSource<Tenant>{
    private _tenants = new BehaviorSubject<Tenant[]>([]);

    constructor(
        private _tenantService:TenantService,
        initialData:Tenant[]=[]
    ){
        super(initialData);
        this._tenants.next(initialData);
    }

    connect(): BehaviorSubject<Tenant[]>{
        return this._tenants;
    }

    disconnect(): void{
        this._tenants.unsubscribe();
    }

    loadTenants(params?:TenantParams){
        return this._tenantService.getTenants(params)
        .subscribe(data=>{
            this._tenants.next(data);
            this.data=data;
        });
    }

    addTenant(tenant:Tenant){
        this.data.push(tenant);
        this._tenants.next(this.data);
    }

}