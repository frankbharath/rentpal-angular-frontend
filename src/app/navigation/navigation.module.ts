import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NavigationRoutingModule } from './navigation-routing.module';
import { NavigationComponent } from './navigation.component';
import { FormsModule } from '@angular/forms';
import { MaterialModule } from '../share/material/material.module';
import { DashboardModule } from '../dashboard/dashboard.module';
import { PropertyModule } from '../property/property.module';
import { TenantModule } from '../tenant/tenant.module';
import { ShareModule } from '../share/share.module';
import { ProfileModule } from '../profile/profile.module';


@NgModule({
  declarations: [NavigationComponent],
  imports: [
    CommonModule,
    ShareModule,
    NavigationRoutingModule,
    DashboardModule,
    PropertyModule,
    TenantModule,
    ProfileModule,
    FormsModule,
    MaterialModule
  ],
  exports:[NavigationRoutingModule]
})
export class NavigationModule { }
