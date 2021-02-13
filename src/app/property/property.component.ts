import { SelectionModel } from '@angular/cdk/collections';
import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { ActivatedRoute, Router } from '@angular/router';
import { fromEvent, Observable, of } from 'rxjs';
import { debounceTime, distinctUntilChanged, map} from 'rxjs/operators';
import { Property } from '../share/models/property.model';
import { PropertyDataSource } from '../core/property-data-source';
import { PropertyService } from '../core/property.service';
import { Utils } from '../share/utils';

@Component({
  selector: 'app-property',
  templateUrl: './property.component.html',
  styleUrls: ['./property.component.css']
})

export class PropertyComponent implements OnInit, AfterViewInit, OnDestroy {
  private _pageSize=50;
  private _pageIndex=0;
  private _displayedColumns: string[] = ['select', 'propertyname', 'addressline_1', 'addressline_2', 'city', 'postal', 'creationtime', 'actions'];
  private _dataSource!:PropertyDataSource;
  private _hideAddForm=false;
  private _property:Property | undefined;
  private _searchQuery='';
  private _selection = new SelectionModel<Property>(true, []);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild('searchInput') searchInput!: ElementRef;

  constructor(
    private _route:ActivatedRoute, 
    private _propertyService:PropertyService, 
    private _utils:Utils,
    private _router: Router) {}
  
  ngOnInit(): void {
    this._route.data.subscribe(data=>{
      this._dataSource=new PropertyDataSource(this._propertyService, data.properties);
    });
    const propertyParams=sessionStorage.getItem("propertyParams");
    if(propertyParams){
      const obj=JSON.parse(propertyParams);
      this._pageIndex=obj.pageIndex;
      this._pageSize=obj.pageSize;
      this._searchQuery=obj.searchQuery;
    }
  }

  ngAfterViewInit(): void {
    this.paginator.page.subscribe((data: any)=>{
      this.paginator.pageIndex = data.pageSize!==this.pageSize?0:data.pageIndex;
      this._pageSize=data.pageSize;
      this.loadProperties(false);
    });
    fromEvent(this.searchInput.nativeElement, 'keyup')
    .pipe(
      map(() => this.searchInput.nativeElement.value),
      debounceTime(500),
      distinctUntilChanged()
    ).subscribe(()=>{
        this.paginator.pageIndex = 0;
        this.loadProperties(true);
    });

  }
  
  get pageSize(){
    return this._pageSize;
  }

  get pageIndex(){
    return this._pageIndex;
  }

  get displayedColumns(){
    return this._displayedColumns;
  }

  get dataSource(){
    return this._dataSource;
  }
  
  get hideAddForm(){
    return this._hideAddForm;
  }

  get property(){
    return this._property;
  }

  get selection(){
    return this._selection;
  }

  get searchQuery(){
    return this._searchQuery;
  }

  ngOnDestroy(): void {
    this.paginator.page.unsubscribe();
    this.saveState();
  }

  totalProperties():Observable<number>{
    return this._propertyService.getTotalPropertyCount();
  }

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  disableDeleteButton():boolean{
    for(let row of this.dataSource.data){
      if(this.selection.isSelected(row)){
        return false;
      }
    };
    return true;
  }

  masterToggle() {
    this.isAllSelected() ?
        this.selection.clear() :
        this.dataSource.data.forEach(row => {this.selection.select(row)});
  }

  checkboxLabel(row?: Property): string {
    if (!row) {
      return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row `;
  }

  showProperty(property?:Property):void{
    this._property=property;
    this.toggleAddForm();
  }

  bulkDelete(event:MouseEvent):void{
    event.stopPropagation();
    const dialogRef = this._utils.confirmDialog("Confirm Delete", "Deleting the selected properties will remove its units and tenants? Are you sure you want to delete selected properties?");
    dialogRef.afterClosed().subscribe(async dialogResult => {
      if(dialogResult){
        let selectedIds=new Array<number>();
        this.dataSource.data.forEach(row=>{
          if(this.selection.isSelected(row) && row.id){
            selectedIds.push(row.id);
          }
        });
        try{
          await this._propertyService.deleteProperties(selectedIds);
          this._utils.showMessage("Selected properties deleted successfully.");
          this.loadProperties(true);
        }catch(error){}
      }
    });
  }

  delete(event:MouseEvent, element:Property):void{
    event.stopPropagation();
    const dialogRef = this._utils.confirmDialog("Confirm Delete", "Deleteing the property will remove its units and tenants? Are you sure you want to delete the property?");
    dialogRef.afterClosed().subscribe(async dialogResult => {
      if(dialogResult){
        if(element.id===undefined){
          return;
        }
        await this._propertyService.deleteProperty(element.id);
        this._utils.showMessage("Property deleted successfully.");
        this.loadProperties(true);
      }
    });
  }

  loadProperties(countRequired:boolean=false){
    this.selection.clear();
    let params={"pageIndex":this.paginator.pageIndex, "pageSize":this.paginator.pageSize, "searchQuery":this.searchInput.nativeElement.value, "countRequired":countRequired};
    this.saveState();
    this.dataSource.loadProperties(params);
  }

  loadUnits(property:Property){
    this._router.navigate([`/properties/${property.id}/units`]);
  }

  saveState(){
    const obj={"pageIndex":this.paginator.pageIndex, "pageSize":this.paginator.pageSize, "searchQuery":this.searchInput.nativeElement.value};
    sessionStorage.setItem("propertyParams", JSON.stringify(obj));
  }

  toggleAddForm(){
    this._hideAddForm=!this._hideAddForm;
  }

  updateAndClose(property:Property){
    if(this.property){
      this.dataSource.updateProperty(property);
    }else{
      this.paginator.length=++this.paginator.length;
      if(this.dataSource.data.length<this.paginator.pageSize){
        this.dataSource.addProperty(property);
      }
    }
    this.toggleAddForm();
  }
}
