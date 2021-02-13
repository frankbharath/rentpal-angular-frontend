import { SelectionModel } from '@angular/cdk/collections';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { ActivatedRoute, Router } from '@angular/router';
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

  private _displayedColumns: string[] = ['select', 'doorNumber', 'floorNumber', 'bedrooms', 'bathrooms', 'area', 'rent', 'cautionDeposit', 'furnished', 'actions'];
  private _pageSize=50;
  private _selection = new SelectionModel<Unit>(true, []);
  @ViewChild(MatPaginator) private _paginator!: MatPaginator;
  @ViewChild(UnitFormComponent) private _unitForm!:UnitFormComponent;
  private _propertyId!:any;
  private _hideAddForm=false;
  private _unit!:Unit | undefined;
  private _dataSource!:UnitDataSource

  constructor(
    private _route:ActivatedRoute, 
    private _router:Router,
    private _utils:Utils,
    private _unitService:UnitService
  ) { }

  get displayedColumns(){
    return this._displayedColumns;
  }

  get pageSize(){
    return this._pageSize;
  }

  get selection(){
    return this._selection;
  }

  get paginator(){
    return this._paginator;
  }

  get unitForm(){
    return this._unitForm;
  }

  get hideAddForm(){
    return this._hideAddForm;
  }

  get dataSource(){
    return this._dataSource;
  }

  get propertyId(){
    return this._propertyId;
  }

  set propertyId(propertyId){
    this._propertyId=propertyId;
  }

  get unit(){
    return this._unit;
  }
 
  ngOnInit(): void {
    this.propertyId=this._route.snapshot.paramMap.get("id");
    this._route.data.subscribe(data=>{
      this._dataSource=new UnitDataSource(this._unitService, data.unit);
    });
  }

  ngAfterViewInit(): void {
    this.paginator.page.subscribe((data: any)=>{
      this.paginator.pageIndex = data.pageSize!==this._pageSize?0:data.pageIndex;
      this._pageSize=data.pageSize;
      this.loadUnits();
    });
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
    const dialogRef = this._utils.confirmDialog("Confirm Delete", "Deleting the unit will remove its tenants? Are you sure you want to delete the unit?");
    dialogRef.afterClosed().subscribe(async dialogResult => {
      if(dialogResult){
        try{
          if(!unit.id){
            return;
          }
          await this._unitService.deleteUnit(this.propertyId, unit.id);
          this._utils.showMessage("Unit deleted successfully.");
          this.loadUnits(true);
        }catch(error){}
      }
    });
  }

  bulkDelete(){
    const dialogRef = this._utils.confirmDialog("Confirm Delete", "Deleting the selected units will remove its tenants? Are you sure you want to delete the selected units?");
    dialogRef.afterClosed().subscribe(async dialogResult => {
      if(dialogResult){
        let selectedIds=new Array<number>();
        this._dataSource.data.forEach(row=>{
          if(this.selection.isSelected(row) && row.id){
            selectedIds.push(row.id);
          }
        });
        try{
          await this._unitService.deleteUnits(Number(this.propertyId), selectedIds);
          this._utils.showMessage("Selected units deleted successfully.");
          this.loadUnits(true);
        }catch(error){}
      }
    });
  }

  goBack():void{
    this._router.navigate(['/properties', { state:true}]);
  }

  toggleAddForm(){
    this._hideAddForm=!this._hideAddForm;
  }

  showUnit(unit?:Unit){
    this._unit=unit;
    this.toggleAddForm();
  }

  updateAndCloseForm(unit:Unit){
    if(this.unit){
      this._dataSource.updateUnit(unit);
    }else{
      this.paginator.length=++this.paginator.length;
      if(this._dataSource.data.length<this.paginator.pageSize){
        this._dataSource.addUnit(unit);
      }
    }
    this.toggleAddForm();
  }
}
