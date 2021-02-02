import { Injectable } from "@angular/core";
import { FormControl } from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";
import { MatSnackBar } from "@angular/material/snack-bar";
import { ConfirmDialogModel, ConfirmDialogComponent } from "./confirm-dialog/confirm-dialog.component";

@Injectable({
    providedIn: 'root'
})
  
export class Utils{
    constructor(
        private _snackBar: MatSnackBar,
        private dialog: MatDialog
    ){}
    static removeSpaces(control: FormControl) {
        if (control && control.value && !control.value.replace(/\s/g, '').length) {
            control.setValue('');
          }
          //return '';
    }
    showMessage(message:string, isError:boolean=false){
        this._snackBar.open(message, '', {
            duration: 5000,
            panelClass: [isError?"red-snackbar":"green-snackbar"],
            verticalPosition: 'top'
        });
    }
    confirmDialog(title:string, message:string){
        const dialogData = new ConfirmDialogModel(title, message);
        const dialogRef = this.dialog.open(ConfirmDialogComponent, {
            maxWidth: "400px",
            data: dialogData
        });
        return dialogRef;
    }
}
