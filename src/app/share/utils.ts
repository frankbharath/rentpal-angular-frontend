import { Injectable } from "@angular/core";
import { FormControl } from "@angular/forms";
import { MatSnackBar } from "@angular/material/snack-bar";

@Injectable({
    providedIn: 'root'
})
  
export class Utils{
    constructor(
        private _snackBar: MatSnackBar
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
}
