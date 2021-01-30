import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PropertyRoutingModule } from './property-routing.module';
import { PropertyComponent } from './property.component';
import { ShareModule } from '../share/share.module';
import { PropertyFormComponent } from './property-form/property-form.component';
import { ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [PropertyComponent, PropertyFormComponent],
  imports: [
    CommonModule,
    PropertyRoutingModule,
    ShareModule,
    ReactiveFormsModule
  ]
})
export class PropertyModule { }
