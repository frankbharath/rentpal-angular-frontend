import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CommonModule } from '@angular/common';
import { MaterialModule } from './share/material/material.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { InterceptorService } from './core/interceptor.service';
import { NavigationModule } from './navigation/navigation.module';
import { ShareModule } from './share/share.module';
import { ReactiveFormsModule } from '@angular/forms';
import { LoginComponent } from './login/login.component';
import { TenantAPI } from './tenant/tenant-api';
import { END_POINTS } from './core/api.service';
import { PropertyAPI } from './property/property-api';
import { UnitAPI } from './property/unit/unit-api';
import { AuthAPI } from './login/auth-api';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent
  ],
  imports: [
    ShareModule,
    CommonModule,
    HttpClientModule,
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    MaterialModule,
    BrowserAnimationsModule,
    NavigationModule,
    ReactiveFormsModule
  ],
  providers: [
    {provide:HTTP_INTERCEPTORS, useClass:InterceptorService, multi:true},
    {provide:END_POINTS, multi:true, useValue:TenantAPI},
    {provide:END_POINTS, multi:true, useValue:PropertyAPI},
    {provide:END_POINTS, multi:true, useValue:UnitAPI},
    {provide:END_POINTS, multi:true, useValue:AuthAPI}
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }