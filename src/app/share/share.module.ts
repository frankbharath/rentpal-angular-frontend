import { NgModule } from '@angular/core';
import { ConfirmDialogComponent } from './confirm-dialog/confirm-dialog.component';
import { StopPropagationDirective } from './directives/stop-propagation';
import { MaterialModule } from './material/material.module';
import { OverlayComponent } from './overlay/overlay.component';

@NgModule({
  declarations: [StopPropagationDirective, ConfirmDialogComponent, OverlayComponent],
  imports: [MaterialModule],
  exports: [StopPropagationDirective, ConfirmDialogComponent, MaterialModule, OverlayComponent]
})

export class ShareModule { }
