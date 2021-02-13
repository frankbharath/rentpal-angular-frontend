import { NgModule } from '@angular/core';
import { NgApexchartsModule } from 'ng-apexcharts';
import { ConfirmDialogComponent } from './confirm-dialog/confirm-dialog.component';
import { StopPropagationDirective } from './directives/stop-propagation';
import { MaterialModule } from './material/material.module';
import { OverlayComponent } from './overlay/overlay.component';
import { TruncatePipe } from './pipes/truncate.pipe';

@NgModule({
  declarations: [StopPropagationDirective, ConfirmDialogComponent, OverlayComponent, TruncatePipe],
  imports: [MaterialModule],
  exports: [StopPropagationDirective, ConfirmDialogComponent, MaterialModule, NgApexchartsModule, OverlayComponent, TruncatePipe]
})

export class ShareModule { }
