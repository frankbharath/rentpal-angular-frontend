import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ShareModule } from '../share/share.module';
import { ReactiveFormsModule } from '@angular/forms';
import { ProfileComponent } from './profile.component';


@NgModule({
  declarations: [ProfileComponent],
  imports: [
    CommonModule,
    ShareModule,
    ReactiveFormsModule
  ]
})
export class ProfileModule { }
