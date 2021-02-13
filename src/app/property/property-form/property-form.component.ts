import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Property } from 'src/app/share/models/property.model';
import { Utils } from 'src/app/share/utils';
import { PropertyService } from 'src/app/core/property.service';

@Component({
  selector: 'app-property-form',
  templateUrl: './property-form.component.html',
  styleUrls: ['./property-form.component.css']
})
export class PropertyFormComponent implements OnInit {

  private _propertyFormGroup!: FormGroup; 
  @Input() property:Property | undefined;
  @Output() updateAndClose = new EventEmitter<Property>();
  @Output() close = new EventEmitter<void>();
  private _disableSubmit=false;
  private _isAddForm = true;

  constructor(
    private fb: FormBuilder,  
    private propertyService:PropertyService,
    private _utils: Utils,
  ) {}
 
  get propertyFormGroup(){
    return this._propertyFormGroup;
  }
  
  get isAddForm(){
    return this._isAddForm;
  }

  get disableSubmit(){
    return this._disableSubmit;
  }

  ngOnInit() {
    this._isAddForm = this.property===undefined;
    this._propertyFormGroup = this.fb.group({
      propertyname: [this.property?.propertyname,[Utils.removeSpaces, Validators.required, Validators.pattern('^[^`~.><":{}=+]+$'), Validators.minLength(1), Validators.maxLength(64)]],
      addressline_1: [this.property?.addressline_1,[Utils.removeSpaces, Validators.required, Validators.pattern('^[^`~.><":{}=+]+$'), Validators.minLength(1), Validators.maxLength(128)]],
      addressline_2:[this.property?.addressline_2, [Utils.removeSpaces, Validators.pattern('^[^`~.><":{}=+]+$'), Validators.minLength(1), Validators.maxLength(128)]],
      postal:[this.property?.postal,[Utils.removeSpaces, Validators.required, Validators.pattern('^[0-9]{5}$')]],
      city:[this.property?.city,[Utils.removeSpaces, Validators.required, Validators.pattern('^[^`~.><":{}=+]+$'), Validators.minLength(1), Validators.maxLength(64)]]
    });
  }

  closeFun(){
    this.close.emit();
  }
  
  updateAndCloseFun(property:Property):void{
    this.updateAndClose.emit(property);
  }

  async save():Promise<void>{
    this._disableSubmit=true;
    this.property={
      ...this.property, 
      propertyname:this.propertyFormGroup.controls.propertyname.value,
      addressline_1:this.propertyFormGroup.controls.addressline_1.value,
      addressline_2:this.propertyFormGroup.controls.addressline_2.value,
      postal:this.propertyFormGroup.controls.postal.value,
      city:this.propertyFormGroup.controls.city.value
    }
    try{
      let property;
      if(!this.isAddForm){
        property=await this.propertyService.updateProperty(this.property);
        this._utils.showMessage("Property updated successfully.");
      }else{
        property=await this.propertyService.saveProperty(this.property);
        this._utils.showMessage("Property added successfully.");
      }
      this.updateAndCloseFun(property);
    }catch(ex){
      this._disableSubmit=false;
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
