import { SelectionModel } from '@angular/cdk/collections';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { Observable } from 'rxjs';
import { UnitDataSource } from 'src/app/core/unit-data-source';
import { UnitService } from 'src/app/core/unit.service';
import { Unit } from 'src/app/share/models/unit.model';
import { Utils } from 'src/app/share/utils';
import { UnitFormComponent } from './unit-form/unit-form.component';

@Component({
  selector: 'app-unit',
  templateUrl: './unit.component.html',
  styleUrls: ['./unit.component.css']
})


export class UnitComponent implements OnInit, AfterViewInit {

  displayedColumns: string[] = ['select', 'doorNumber', 'floorNumber', 'bedrooms', 'bathrooms', 'area', 'rent', 'cautionDeposit', 'furnished', 'actions'];
  _pageSize=50;
  selection = new SelectionModel<Unit>(true, []);
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(UnitFormComponent) unitForm!:UnitFormComponent;
  propertyId!:any;
  _hideAddForm=false;

  constructor(
    public _dataSource:UnitDataSource,
    private _location: Location, 
    private _route:ActivatedRoute, 
    private _utils:Utils,
    private _unitService:UnitService
  ) { }

  ngOnInit(): void {
    this.propertyId=this._route.snapshot.paramMap.get("id");
    this._route.data.subscribe(data=>{
      this._dataSource.loadUnitsWithArray(data.unit);
    });
  }

  ngAfterViewInit(): void {
    this.paginator.page.subscribe((data: any)=>{
      this.paginator.pageIndex = data.pageSize!==this._pageSize?0:data.pageIndex;
      this._pageSize=data.pageSize;
      this.loadUnits();
    });
  }

  refreshTable(){
    this.toggleAddForm();
    this.loadUnits(true);
  }

  loadUnits(countRequired=false):void{
    this.selection.clear();
    this._dataSource.loadUnits(this.propertyId, {pageIndex:this.paginator.pageIndex, pageSize:this.paginator.pageSize, countRequired:countRequired});
  }

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this._dataSource.data.length;
    return numSelected === numRows;
  }

  masterToggle() {
    this.isAllSelected() ?
        this.selection.clear() :
        this._dataSource.data.forEach(row => {this.selection.select(row)});
  }

  checkboxLabel(row?: Unit): string {
    if (!row) {
      return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row `;
  }

  disableDeleteButton():boolean{
    for(let row of this._dataSource.data){
      if(this.selection.isSelected(row)){
        return false;
      }
    };
    return true;
  }

  totalUnits():Observable<number>{
    return this._dataSource.totalUnits();
  }

  deleteUnit(event:MouseEvent, unit:Unit){
    event.stopPropagation();
    const dialogRef = this._utils.confirmDialog("Confirm Delete", "Are you sure you want to delete the unit?");
    dialogRef.afterClosed().subscribe(async dialogResult => {
      if(dialogResult){
        try{
          await this._unitService.deleteUnit(Number(this.propertyId), Number(unit.id));
          this._utils.showMessage("Unit deleted successfully.");
          this.loadUnits(true);
        }catch(error){}
      }
    });
  }

  bulkDelete(){
    const dialogRef = this._utils.confirmDialog("Confirm Delete", "Are you sure you want to delete the selected units?");
    dialogRef.afterClosed().subscribe(async dialogResult => {
      if(dialogResult){
        let selectedIds=this._dataSource.data.filter(row=>this.selection.isSelected(row)).map(row=>row.id);
        if(selectedIds.length===0){
          return;
        }
        try{
          await this._unitService.deleteUnits(Number(this.propertyId), selectedIds);
          this._utils.showMessage("Selected units deleted successfully.");
          this.loadUnits(true);
        }catch(error){}
      }
    });
  }

  goBack():void{
    this._location.back();
  }

  toggleAddForm(){
    this._hideAddForm=!this._hideAddForm;
  }
}
