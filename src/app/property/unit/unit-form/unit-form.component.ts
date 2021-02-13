import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UnitService } from 'src/app/core/unit.service';
import { Unit } from 'src/app/share/models/unit.model';
import { Utils } from 'src/app/share/utils';

@Component({
  selector: 'app-unit-form',
  templateUrl: './unit-form.component.html',
  styleUrls: ['./unit-form.component.css']
})
export class UnitFormComponent implements OnInit {

  private _unitFormGroup!: FormGroup;
  private _isAddForm=true;
  private _disableSubmit=false;
  @Input() propertyId!:number;
  @Input() unit!: Unit | undefined;
  @Output() closeForm = new EventEmitter<void>();
  @Output() updateAndCloseForm = new EventEmitter<Unit>();
 
  constructor(
    private _fb: FormBuilder,
    private _unitService:UnitService,
    private _utils:Utils
  ) { }

  get isAddForm(){
    return this._isAddForm;
  }

  get unitFormGroup(){
    return this._unitFormGroup;
  }

  get disableSubmit(){
    return this._disableSubmit;
  }

  ngOnInit(): void {
    this._isAddForm=this.unit===undefined;
    this._unitFormGroup = this._fb.group({
      doorNumber:[this.unit?.doorNumber, [Utils.removeSpaces, Validators.required, Validators.pattern('^[a-zA-Z0-9]+$'), Validators.maxLength(4)]],
      floorNumber:[!this._isAddForm?String(this.unit?.floorNumber):'', [Utils.removeSpaces, Validators.required, Validators.pattern('^[0-9]{1,8}$')]],
      bedrooms:[!this._isAddForm?String(this.unit?.bedrooms):'', [Utils.removeSpaces, Validators.required, Validators.pattern('^[0-9]{1,8}$')]],
      bathrooms:[!this._isAddForm?String(this.unit?.bathrooms):'', [Utils.removeSpaces, Validators.required, Validators.pattern('^[0-9]{1,8}$')]],
      area:[!this._isAddForm?String(this.unit?.area):'', [Utils.removeSpaces, Validators.required, Validators.pattern('^([0-9]{1,5}\\.[0-9]{1,2}|[0-9]{1,5})$')]],
      rent:[!this._isAddForm?String(this.unit?.rent):'', [Utils.removeSpaces, Validators.required, Validators.pattern('^([0-9]{1,5}\\.[0-9]{1,2}|[0-9]{1,5})$')]],
      cautionDeposit:[!this._isAddForm?String(this.unit?.cautionDeposit):'', [Utils.removeSpaces, Validators.required, Validators.pattern('^([0-9]{1,5}\\.[0-9]{1,2}|[0-9]{1,5})$')]],
      furnished:[this.unit?.furnished, [Validators.required, Validators.pattern('^(true|false)$')]]
    });
  }

  async save():Promise<void>{
    this._disableSubmit=true;
    this.unit={
      ...this.unit,
      doorNumber:this.unitFormGroup.controls.doorNumber.value,
      floorNumber:this.unitFormGroup.controls.floorNumber.value,
      bedrooms:this.unitFormGroup.controls.bedrooms.value,
      bathrooms:this.unitFormGroup.controls.bathrooms.value,
      area:this.unitFormGroup.controls.area.value,
      rent:this.unitFormGroup.controls.rent.value,
      cautionDeposit:this.unitFormGroup.controls.cautionDeposit.value,
      furnished:this.unitFormGroup.controls.furnished.value
    }
    try{
      let unit;
      if(this._isAddForm){
        unit=await this._unitService.saveUnit(this.propertyId, this.unit);
        this._utils.showMessage("Unit saved successfully.");
      }else{
        unit=await this._unitService.updateUnit(this.propertyId, this.unit);
        this._utils.showMessage("Unit updated successfully.");
      }
      this.updateAndCloseForm.emit(unit);
    }catch(ex){
      this._disableSubmit=false;
      if(ex.status === 422){
        let errors=ex.error.message;
        for(let error of errors){
          let field=this.unitFormGroup.get(error.field);
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

  close(){
    this.closeForm.emit();
  }
}
