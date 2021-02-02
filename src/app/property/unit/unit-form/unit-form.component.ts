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

  unitFormGroup!: FormGroup;
  unit:Unit=new Unit();
  @Output() closeForm = new EventEmitter<void>();
  @Output() refreshTable = new EventEmitter<void>();
  @Input() propertyId!:number;
  
  constructor(
    private fb: FormBuilder,
    private _unitService:UnitService,
    private _utils:Utils
  ) { }

  ngOnInit(): void {
    this.unitFormGroup = this.fb.group({
      doorNumber:[this.unit.doorNumber, [Utils.removeSpaces, Validators.required, Validators.pattern('^[a-zA-Z0-9]+$'), Validators.maxLength(4)]],
      floorNumber:[this.unit.floorNumber, [Utils.removeSpaces, Validators.required, Validators.pattern('^[0-9]{1,8}$')]],
      bedrooms:[this.unit.bedrooms, [Utils.removeSpaces, Validators.required, Validators.pattern('^[0-9]{1,8}$')]],
      bathrooms:[this.unit.bathrooms, [Utils.removeSpaces, Validators.required, Validators.pattern('^[0-9]{1,8}$')]],
      area:[this.unit.area, [Utils.removeSpaces, Validators.required, Validators.pattern('^([0-9]{1,5}\\.[0-9]{1,2}|[0-9]{1,5})$')]],
      rent:[this.unit.rent, [Utils.removeSpaces, Validators.required, Validators.pattern('^([0-9]{1,5}\\.[0-9]{1,2}|[0-9]{1,5})$')]],
      cautionDeposit:[this.unit.cautionDeposit, [Utils.removeSpaces, Validators.required, Validators.pattern('^([0-9]{1,5}\\.[0-9]{1,2}|[0-9]{1,5})$')]],
      furnished:[this.unit.furnished, [Validators.required, Validators.pattern('^(true|false)$')]]
    });
  }

  async save():Promise<void>{
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
      await this._unitService.saveUnit(this.propertyId, this.unit);
      this._utils.showMessage("Unit saved successfully.");
      this.refreshTable.emit();
    }catch(ex){
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

  close():void{
    this.closeForm.emit();
  }
}
