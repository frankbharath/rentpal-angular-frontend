import { NgModule } from '@angular/core';
import { NgApexchartsModule } from 'ng-apexcharts';
import { ConfirmDialogComponent } from './confirm-dialog/confirm-dialog.component';
import { MaterialModule } from './material/material.module';
import { OverlayComponent } from './overlay/overlay.component';
import { TruncatePipe } from './pipes/truncate.pipe';
import { TrimDirective } from './directives/trim.directive';
import { InfoDialogComponent } from './info-dialog/info-dialog.component';

@NgModule({
  declarations: [
    ConfirmDialogComponent, 
    OverlayComponent, 
    TruncatePipe, 
    TrimDirective, InfoDialogComponent
  ],
  imports: [MaterialModule],
  exports: [ 
    ConfirmDialogComponent, 
    MaterialModule, 
    NgApexchartsModule, 
    OverlayComponent, 
    TruncatePipe,  
    TrimDirective
  ]
})

export class ShareModule { }
