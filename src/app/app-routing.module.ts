import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DashboardResolverService } from './core/dashboard-resolver.service';
import { LoginGuardService as LoginGuard} from './core/login-guard.service';
import { ProfileResolverService } from './core/profile-resolver.service';
import { PropertyResolverService } from './core/property-resolver.service';
import { TenantResolverService } from './core/tenant-resolver.service';
import { UnitResolverService } from './core/unit-resolver.service';
import { DashboardComponent } from './dashboard/dashboard.component';
import { LoginComponent } from './login/login.component';
import { NavigationComponent } from './navigation/navigation.component';
import { ProfileComponent } from './profile/profile.component';
import { PropertyFormComponent } from './property/property-form/property-form.component';
import { PropertyComponent } from './property/property.component';
import { UnitComponent } from './property/unit/unit.component';
import { SettingsComponent } from './settings/settings.component';
import { TenantComponent } from './tenant/tenant.component';

const routes: Routes = [
  {
    path:"", component:NavigationComponent,
    children:[
      {
        path:"", 
        redirectTo:"/login", 
        pathMatch:"full"},
      {
        path:"dashboard", 
        component:DashboardComponent
      },
      {
        path:"properties", 
        component:PropertyComponent,
        resolve:{
          properties:PropertyResolverService
        },
        children:[
          {
            path:"add",
            component:PropertyFormComponent
          },
          {
            path:"edit/:id",
            component:PropertyFormComponent,
            resolve:{
              property:PropertyResolverService
            }
          },
        ]
      },
      {
        path:"properties/:id/units",
        component:UnitComponent,
        resolve:{
          unit:UnitResolverService
        }
      },
      {
        path:"tenants", 
        component:TenantComponent,
        resolve:{
          tenants:TenantResolverService
        }
      },
      {
        path:"settings", 
        component:SettingsComponent
      },
      {
        path:"profile",
        component:ProfileComponent,
        resolve:{
          profile:ProfileResolverService
        }
      }
    ]
  },
  {
    path:"login", 
    component:LoginComponent, 
    canActivate:[LoginGuard]
  },
  {path:"**", component:NavigationComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
