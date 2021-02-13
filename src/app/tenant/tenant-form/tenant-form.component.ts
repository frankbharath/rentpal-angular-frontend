import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Utils } from 'src/app/share/utils';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import * as _moment from 'moment';
import { default as _rollupMoment } from 'moment';
import countries from '../../../assets/en.json';
import { PropertyService } from 'src/app/core/property.service';
import { Property } from 'src/app/share/models/property.model';
import { Observable } from 'rxjs';
import { Unit } from 'src/app/share/models/unit.model';
import { UnitService } from 'src/app/core/unit.service';
import { Tenant } from 'src/app/share/models/tenant.model';
import { TenantService } from 'src/app/core/tenant.service';
import { DatePipe } from '@angular/common';

const moment = _rollupMoment || _moment;

export const MY_FORMATS = {
  parse: {
    dateInput: 'MMM DD, YYYY',
  },
  display: {
    dateInput: 'MMM DD, YYYY',
    monthYearLabel: 'YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'YYYY',
  },
};

@Component({
  selector: 'app-tenant-form',
  templateUrl: './tenant-form.component.html',
  styleUrls: ['./tenant-form.component.css'],
  providers: [
    {provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE]},
    {provide: MAT_DATE_FORMATS, useValue: MY_FORMATS},
  ]
})
export class TenantFormComponent implements OnInit {

  @Output() close = new EventEmitter<void>();
  @Output() updateAndClose = new EventEmitter<Tenant>();
  tenantForm!: FormGroup;
  private _countries=countries;
  properties!:Observable<Property[]>;
  units!:Observable<Unit[]>;
  disableSubmit=false;
  minDate!: any;
  maxDate!: any;
  moveInDate!:any;
  moveOutDate!:any;

  constructor(
    private _fb: FormBuilder,
    private _tenantService:TenantService,
    private _propertyService:PropertyService,
    private _unitService:UnitService,
    private _utils: Utils
  ) {
  }

  ngOnInit(): void {
    this.tenantForm = this._fb.group({
      firstName:['', [Utils.removeSpaces, Validators.required, Validators.pattern("^[a-zA-Z]+(?:[\s]{1}[a-zA-Z]+)*$"), Validators.maxLength(255)]],
      lastName:['', [Utils.removeSpaces, Validators.required, Validators.pattern("^[a-zA-Z]+(?:[\s]{1}[a-zA-Z]+)*$"), Validators.maxLength(255)]],
      email:['', [Utils.removeSpaces, Validators.required, Validators.pattern("^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$"), Validators.maxLength(255)]],
      dob:['', [Validators.required]],
      nationality:['', [Validators.required]],
      unitId:['', [Validators.required]],
      propertyId:['', [Validators.required]],
      movein:['', [Validators.required]],
      moveout:['', [Validators.required]],
      occupants:['', [Utils.removeSpaces, Validators.required, Validators.pattern('^[1-9]+[0-9]*$'), Validators.maxLength(5)]]
    });
    this.properties=this._propertyService.getProperties();
    this.minDate= moment();
    this.moveInDate=this.minDate;
    this.changeMaxDate();
  }

  changeMaxDate(){
    const diff=moment(this.moveOutDate).diff(moment(this.moveInDate), 'days');
    this.maxDate=moment(this.moveInDate).add(29, "days");
    if(diff<29){
      this.moveOutDate=this.maxDate;
    }
  }

  get countries(){
    return this._countries;
  }

  async save(){
    this.disableSubmit=true;
    let tenant:Tenant={
      email:this.tenantForm.controls.email.value,
      firstName:this.tenantForm.controls.firstName.value,
      lastName:this.tenantForm.controls.lastName.value,
      dob:new DatePipe('en-US').transform(this.tenantForm.controls.dob.value, 'MMM dd, YYYY') || '',
      nationality:this.tenantForm.controls.nationality.value,
      unitId:this.tenantForm.controls.unitId.value,
      propertyId:this.tenantForm.controls.propertyId.value,
      movein:new DatePipe('en-US').transform(this.tenantForm.controls.movein.value, 'MMM dd, YYYY') || '',
      moveout:new DatePipe('en-US').transform(this.tenantForm.controls.moveout.value, 'MMM dd, YYYY') || '',
      occupants:this.tenantForm.controls.occupants.value
    };
    try{
      tenant=await this._tenantService.saveTenant(tenant);
      this._utils.showMessage("Tenant saved successfully.");
      this.updateAndClose.emit(tenant);
    }catch(ex){
      this.disableSubmit=false;
      if(ex.status === 422){
        let errors=ex.error.message;
        for(let error of errors){
          let field=this.tenantForm.get(error.field);
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

  loadUnits(id:any){
    this.units=this._unitService.getUnits(id);
  }

  closeFun(){
    this.close.emit();
  }
}
