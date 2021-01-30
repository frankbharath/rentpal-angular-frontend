import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PropertyResolverService } from './core/property-resolver.service';
import { DashboardComponent } from './dashboard/dashboard.component';
import { NavigationComponent } from './navigation/navigation.component';
import { PropertyFormComponent } from './property/property-form/property-form.component';
import { PropertyComponent } from './property/property.component';
import { SettingsComponent } from './settings/settings.component';
import { TenantComponent } from './tenant/tenant.component';

const routes: Routes = [
  {
    path:"", component:NavigationComponent,
    children:[
      {
        path:"", 
        redirectTo:"/dashboard", 
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
          }
        ]
      },
      {
        path:"tenants", 
        component:TenantComponent
      },
      {
        path:"settings", 
        component:SettingsComponent
      }
    ]
  },
  {path:"**", component:NavigationComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
