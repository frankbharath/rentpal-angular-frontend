import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { Property } from 'src/app/share/models/property.model';
import { Location } from '@angular/common';
import { Utils } from 'src/app/share/utils';
import { PropertyService } from 'src/app/core/property.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-property-form',
  templateUrl: './property-form.component.html',
  styleUrls: ['./property-form.component.css']
})
export class PropertyFormComponent implements OnInit {

  propertyFormGroup!: FormGroup; 
  property:Property=new Property();

  constructor(
    private fb: FormBuilder, 
    private _location: Location, 
    private propertyService:PropertyService,
    private _utils: Utils) { }
 
  ngOnInit() {
    this.propertyFormGroup = this.fb.group({
      propertyname: ['',[Utils.removeSpaces, Validators.required, Validators.pattern('^[^`~.><":{}=+]+$'), Validators.minLength(1), Validators.maxLength(64)]],
      addressline_1: ['',[Utils.removeSpaces, Validators.required, Validators.pattern('^[^`~.><":{}=+]+$'), Validators.minLength(1), Validators.maxLength(128)]],
      addressline_2:['', [Utils.removeSpaces, Validators.pattern('^[^`~.><":{}=+]+$'), Validators.minLength(1), Validators.maxLength(128)]],
      postal:['',[Utils.removeSpaces, Validators.required, Validators.pattern('^[0-9]{5}$')]],
      city:['',[Utils.removeSpaces, Validators.required, Validators.pattern('^[^`~.><":{}=+]+$'), Validators.minLength(1), Validators.maxLength(64)]]
    });
  }

  close():void{
    this._location.back();
  }

  async save():Promise<void>{
    this.property={
      ...this.property, 
      propertyname:this.propertyFormGroup.controls.propertyname.value,
      addressline_1:this.propertyFormGroup.controls.addressline_1.value,
      addressline_2:this.propertyFormGroup.controls.addressline_2.value,
      postal:this.propertyFormGroup.controls.postal.value,
      city:this.propertyFormGroup.controls.city.value
    }
    try{
      await this.propertyService.saveProperty(this.property);
      this._utils.showMessage("Property added successfully.");
      this._location.back();
    }catch(ex){
      if(ex.status === 422){
        let errors=ex.error.message;
        for(let error of errors){
          let field=this.propertyFormGroup.get(error.field);
          if(field){
            field.setErrors({
              serverError:error.message
            });
          }
        }
      }else if(ex.status===400){
        this._utils.showMessage(ex.error.message, true);
      }else{
        this._utils.showMessage("Unable to process your request.", true);
      }
    }
  }
}
