import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TenantDataSource } from '../core/tenant-data-source';
import { TenantService } from '../core/tenant.service';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { Tenant } from '../share/models/tenant.model';
import { Observable } from 'rxjs';
import { MatPaginator } from '@angular/material/paginator';
import { Utils } from '../share/utils';

@Component({
  selector: 'app-tenant',
  templateUrl: './tenant.component.html',
  styleUrls: ['./tenant.component.css'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ]
})
export class TenantComponent implements OnInit, AfterViewInit {

  private _pageSize=50;
  private _pageIndex=0;
  private _displayedColumns= [
    ['firstName', 'First name'], 
    ['lastName', 'Last name'], 
    ['email', 'Email'], 
    ['dob', 'Date of birth'], 
    ['nationalityLabel', 'Nationality'], 
    ['movein', 'Move in'], 
    ['moveout', 'Move out'], 
    ['occupants', 'Occupants']];
  private _dataSource!:TenantDataSource;
  private _expandedElement!:Tenant;
  @ViewChild(MatPaginator) 
  private _paginator!: MatPaginator;
  private _hideAddForm=false;
  
  constructor(
    private _route:ActivatedRoute,
    private _tenantService:TenantService,
    private _utils:Utils
    ) { }

  ngOnInit(): void {
    this._route.data.subscribe(data=>{
      this.dataSource=new TenantDataSource(this._tenantService, data.tenants);
    });
  }

  ngAfterViewInit(): void {
    this._paginator.page.subscribe((data: any)=>{
      this._paginator.pageIndex = data.pageSize!==this.pageSize?0:data.pageIndex;
      this._pageSize=data.pageSize;
      this.loadTenant(false);
    });
  }

  set hideAddForm(hideAddForm:boolean){
    this._hideAddForm=hideAddForm;
  }

  get hideAddForm(){
    return this._hideAddForm;
  }

  get expandedElement(){
    return this._expandedElement;
  }

  set expandedElement(expandedElement:Tenant){
    this._expandedElement=expandedElement;
  }

  get displayedColumns(){
    return this._displayedColumns;
  }

  get headerColumns(){
    let cols=this._displayedColumns.map(data=>data[0])
    cols.push("action");
    return cols;
  }

  get dataSource(){
    return this._dataSource;
  }

  set dataSource(dataSource:TenantDataSource){
    this._dataSource=dataSource;
  }

  get pageSize(){
    return this._pageSize
  }

  set pageSize(pageSize:number){
    this._pageSize=pageSize;
  }

  get pageIndex(){
    return this._pageIndex;
  }

  set pageIndex(pageIndex:number){
    this._pageIndex=pageIndex;
  }

  totalProperties():Observable<number>{
    return this._tenantService.totalTenantCount;
  }

  loadTenant(countRequired:boolean=false){
    let params={"pageIndex":this._paginator.pageIndex, "pageSize":this._paginator.pageSize, "countRequired":countRequired};
    this._dataSource.loadTenants(params);
  }

  showTenantForm(){
    this.toggleAddForm();
  }

  toggleAddForm(){
    this.hideAddForm=!this.hideAddForm;
  }

  updateAndClose(tenant:Tenant){
    this._paginator.length=++this._paginator.length;
    if(this._dataSource.data.length<this._paginator.pageSize){
      this._dataSource.addTenant(tenant);
    }
    this.toggleAddForm();
  }

  delete(event:MouseEvent, element:Tenant):void{
    event.stopPropagation();
    const dialogRef = this._utils.confirmDialog("Confirm Delete", "Are you sure you want to delete the tenant?");
    dialogRef.afterClosed().subscribe(async dialogResult => {
      if(dialogResult){
        if(element.id===undefined){
          return;
        }
        await this._tenantService.deleteTenants(element.id);
        this._utils.showMessage("Tenant deleted successfully.");
        this.loadTenant(true);
      }
    });
  }
}
