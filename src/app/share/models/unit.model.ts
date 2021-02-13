import { Property } from "./property.model";

export interface Unit {
    id?: number;
    propertyId?: number;
    bedrooms: number;
    bathrooms: number;
    area: number;
    rent: number;
    cautionDeposit: number;
    furnished: boolean;
    doorNumber: string;
    floorNumber: number;
    propertyDTO?:Property
}
