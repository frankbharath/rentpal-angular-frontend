import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TenantRoutingModule } from './tenant-routing.module';
import { TenantComponent } from './tenant.component';
import { ShareModule } from '../share/share.module';
import { TenantFormComponent } from './tenant-form/tenant-form.component';
import { ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [TenantComponent, TenantFormComponent],
  imports: [
    CommonModule,
    TenantRoutingModule,
    ShareModule,
    ReactiveFormsModule
  ]
})
export class TenantModule { }
