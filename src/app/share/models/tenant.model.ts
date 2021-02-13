import { Unit } from "./unit.model";

export interface Tenant {
    id?:number;
    firstName:string;
    lastName:string;
    email:string;
    dob:string;
    nationality:string;
    nationalityLabel?:string;
    unitId:number;
    propertyId:number;
    movein:string;
    moveout:string;
    occupants:number;
    unitDTO?:Unit;
}
