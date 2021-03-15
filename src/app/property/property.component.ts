import { SelectionModel } from '@angular/cdk/collections';
import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild, ViewChildren } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap} from 'rxjs/operators';
import { Property } from '../share/models/property.model';
import { PropertyDataSource } from '../core/property-data-source';
import { PropertyParams, PropertyService } from '../core/property.service';
import { Utils } from '../share/utils';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-property',
  templateUrl: './property.component.html',
  styleUrls: ['./property.component.css']
})

export class PropertyComponent implements OnInit, AfterViewInit, OnDestroy {
  private readonly _displayedColumns: string[] = ['select', 'propertyname', 'addressline_1', 'addressline_2', 'city', 'postal', 'creationtime', 'actions'];
  private _dataSource!:PropertyDataSource;
  private _hideAddForm=false;
  private _property:Property | undefined;
  private _searchQuery=new FormControl('');
  private _selection = new SelectionModel<Property>(true, []);
  private _defaultFilterValues:PropertyParams = {
    pageIndex:0,
    pageSize:50,
    searchQuery:'',
    countRequired:false
  }
  private _filterSubject = new Subject<void>();
  
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild('searchInput') searchInput!: ElementRef;

  constructor(
    private readonly _route: ActivatedRoute, 
    private readonly _propertyService: PropertyService, 
    private readonly _utils: Utils,
    private readonly _router: Router) {}

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

  get defaultFilterValues(){
    return this._defaultFilterValues;
  }
  
  ngOnInit(): void {
    this._route.data.subscribe(data=>{
      this._dataSource=new PropertyDataSource(data.properties);
    });
    const propertyParams=sessionStorage.getItem("propertyParams");
    if(propertyParams){
      const obj=JSON.parse(propertyParams);
      this._defaultFilterValues.pageIndex=obj.pageIndex;
      this._defaultFilterValues.pageSize=obj.pageSize;
      this._defaultFilterValues.searchQuery=obj.searchQuery;
      this._searchQuery=new FormControl(obj.searchQuery); 
    }
    this._filterSubject.pipe(switchMap(()=>{
      this.selection.clear();
      this.saveState();
      return this._propertyService.getProperties(this._defaultFilterValues);
    })).
    subscribe((properties:Property[])=>{
      this.dataSource.loadProperties(properties);
    });
  }

  ngAfterViewInit(): void {
    this.paginator.page.subscribe((data: PageEvent)=>{
      this.paginator.pageIndex = data.pageSize!==this._defaultFilterValues.pageSize?0:data.pageIndex;
      this._defaultFilterValues.pageSize=data.pageSize;
      this._filterSubject.next();
    });
    this._searchQuery.valueChanges
    .pipe(
      debounceTime(500),
      distinctUntilChanged(),
    ).subscribe(value=>{
      this.paginator.pageIndex = 0;
      this._defaultFilterValues.pageIndex = 0;
      this._defaultFilterValues.searchQuery = value;
      this._filterSubject.next();
    });
  }
  
  
  ngOnDestroy(): void {
    this.paginator.page.unsubscribe();
    this._filterSubject.unsubscribe();
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
          this._defaultFilterValues.countRequired=true;
          this._filterSubject.next();
        }catch(error){}
      }
    });
  }

  delete(event:MouseEvent, element:Property):void{
    event.stopPropagation();
    const dialogRef = this._utils.confirmDialog("Confirm Delete", "Deleting the property will remove its units and tenants? Are you sure you want to delete the property?");
    dialogRef.afterClosed().subscribe(async dialogResult => {
      if(dialogResult){
        if(element.id===undefined){
          return;
        }
        await this._propertyService.deleteProperty(element.id);
        this._utils.showMessage("Property deleted successfully.");
        this._defaultFilterValues.countRequired=true;
        this._filterSubject.next();
      }
    });
  }

  loadUnits(property:Property){
    this._router.navigate([`/properties/${property.id}/units`]);
  }

  saveState(){
    sessionStorage.setItem("propertyParams", JSON.stringify(this._defaultFilterValues));
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
