import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { Property } from 'src/app/share/models/property.model';
import { Location } from '@angular/common';
import { Utils } from 'src/app/share/utils';
import { PropertyService } from 'src/app/core/property.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-property-form',
  templateUrl: './property-form.component.html',
  styleUrls: ['./property-form.component.css']
})
export class PropertyFormComponent implements OnInit {

  propertyFormGroup!: FormGroup; 
  property:Property=new Property();
  propertyId!:any;
  constructor(
    private fb: FormBuilder, 
    private _location: Location, 
    private propertyService:PropertyService,
    private _utils: Utils,
    private route:ActivatedRoute,
    private activatedRoute:ActivatedRoute) {}
 
  ngOnInit() {
    this.propertyId=this.activatedRoute.snapshot.paramMap.get("id");
    if(!this.isAddForm()){
      this.route.data.subscribe(data=>{
        this.property=data.property;
      });
    }
    this.propertyFormGroup = this.fb.group({
      propertyname: [this.property.propertyname,[Utils.removeSpaces, Validators.required, Validators.pattern('^[^`~.><":{}=+]+$'), Validators.minLength(1), Validators.maxLength(64)]],
      addressline_1: [this.property.addressline_1,[Utils.removeSpaces, Validators.required, Validators.pattern('^[^`~.><":{}=+]+$'), Validators.minLength(1), Validators.maxLength(128)]],
      addressline_2:[this.property.addressline_2, [Utils.removeSpaces, Validators.pattern('^[^`~.><":{}=+]+$'), Validators.minLength(1), Validators.maxLength(128)]],
      postal:[this.property.postal,[Utils.removeSpaces, Validators.required, Validators.pattern('^[0-9]{5}$')]],
      city:[this.property.city,[Utils.removeSpaces, Validators.required, Validators.pattern('^[^`~.><":{}=+]+$'), Validators.minLength(1), Validators.maxLength(64)]]
    });
  }

  close():void{
    this._location.back();
  }

  isAddForm():boolean{
    return this.propertyId===null;
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
      if(!this.isAddForm()){
        await this.propertyService.updateProperty(this.property);
        this._utils.showMessage("Property updated successfully.");
      }else{
        await this.propertyService.saveProperty(this.property);
        this._utils.showMessage("Property added successfully.");
      }
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
