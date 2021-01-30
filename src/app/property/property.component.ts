import { SelectionModel } from '@angular/cdk/collections';
import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { ActivatedRoute, Router } from '@angular/router';
import { fromEvent, Observable, of } from 'rxjs';
import { debounceTime, distinctUntilChanged, map} from 'rxjs/operators';
import { ConfirmDialogComponent, ConfirmDialogModel } from '../share/confirm-dialog/confirm-dialog.component';
import { Property } from '../share/models/property.model';
import { PropertyDataSource } from '../core/property-data-source';
import { PropertyService } from '../core/property.service';
import { MatSnackBar } from '@angular/material/snack-bar';


@Component({
  selector: 'app-property',
  templateUrl: './property.component.html',
  styleUrls: ['./property.component.css']
})
export class PropertyComponent implements OnInit, AfterViewInit {

  properties:Property[]=[];
  pageSize=50;
  displayedColumns: string[] = ['select', 'propertyname', 'creationtime', 'addressline_1', 'addressline_2', 'city', 'postal', 'actions'];
  dataSource!:PropertyDataSource;
  selection = new SelectionModel<Property>(true, []);
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild('searchInput') searchInput!: ElementRef;

  constructor(
    private route:ActivatedRoute, 
    private propertyService:PropertyService, 
    private dialog: MatDialog, 
    private _snackBar: MatSnackBar,
    private router: Router) {}
  
  ngOnInit(): void {
    this.route.data.subscribe(data=>{
      this.dataSource=new PropertyDataSource(this.propertyService, data.properties);
    });
  }

  ngAfterViewInit(): void {

    this.paginator.page.subscribe((data: any)=>{
      this.paginator.pageIndex = data.pageSize!==this.pageSize?0:data.pageIndex;
      this.pageSize=data.pageSize;
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

  totalProperties():Observable<number>{
    return this.propertyService.getTotalPropertyCount();
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

  addProperty():void{
    this.router.navigate(['/properties/add']);
  }

  bulkDelete(event:MouseEvent):void{
    event.stopPropagation();
    const message = `Are you sure you want to delete selected properties?`;
    const dialogData = new ConfirmDialogModel("Confirm Delete", message);
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      maxWidth: "400px",
      data: dialogData
    });

    dialogRef.afterClosed().subscribe(async dialogResult => {
      if(dialogResult){
        let selectedIds=this.dataSource.data.filter(row=>this.selection.isSelected(row)).map(row=>row.id);
        if(selectedIds.length===0){
          return;
        }
        try{
          await this.propertyService.deleteProperties(selectedIds);
          this._snackBar.open("Selected properties deleted successfully.", '', {
            duration: 5000,
            panelClass: ["green-snackbar"],
            verticalPosition: 'top'
          });
          this.loadProperties(true);
        }catch(error){}
      }
    });
  }

  delete(event:MouseEvent, element:Property):void{
    event.stopPropagation();
    const message = `Are you sure you want to delete the property?`;
    const dialogData = new ConfirmDialogModel("Confirm Delete", message);
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      maxWidth: "400px",
      data: dialogData
    });
    dialogRef.afterClosed().subscribe(async dialogResult => {
      if(dialogResult){
        await this.propertyService.deleteProperty(element.id);
        this._snackBar.open("Property deleted successfully.", '', {
          duration: 5000,
          panelClass: ["green-snackbar"],
          verticalPosition: 'top'
        });
        this.loadProperties(true);
      }
    });
  }

  loadProperties(countRequired:boolean=false){
    this.selection.clear();
    let params={"pageIndex":this.paginator.pageIndex, "pageSize":this.paginator.pageSize, "searchQuery":this.searchInput.nativeElement.value, "countRequired":countRequired};
    this.dataSource.loadProperties(params);
  }
}