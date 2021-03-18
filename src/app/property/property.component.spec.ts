import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { ActivatedRoute, Router } from '@angular/router';
import { PropertyService } from '../core/property.service';
import { Utils } from '../share/utils';
import { of } from 'rxjs';

import { PropertyComponent } from './property.component';
import { ShareModule } from '../share/share.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ReactiveFormsModule } from '@angular/forms';
import { DebugElement } from '@angular/core';
import { Property } from '../share/models/property.model';
import randomString from 'randomstring';
import { CommonModule } from '@angular/common';
import { HarnessLoader } from '@angular/cdk/testing';
import {MatCheckboxHarness} from '@angular/material/checkbox/testing';
import { HttpResponse } from '@angular/common/http';
import { By } from '@angular/platform-browser';


describe('PropertyComponent', () => {
  let component: PropertyComponent;
  let fixture: ComponentFixture<PropertyComponent>;
  let de: DebugElement;
  let propertySpy: jasmine.SpyObj<PropertyService>;
  let loader: HarnessLoader;
  const mockProperties = [
    {
      id: 1,
      userId: 2,
      propertyname: 'Cite',
      creationtime: 'Aug 06, 2020',
      addressline_1: '10B, Place',
      addressline_2: '',
      city: 'Vitry',
      postal: '94400'
    },
    {
      id: 2,
      userId: 2,
      propertyname: 'cite 1',
      creationtime: 'Aug 06, 2021',
      addressline_1: '10B, Plac1',
      addressline_2: '123',
      city: 'Vitr1',
      postal: '94401'
    }
  ]
  const mockActivatedRoute = {
    data: of({properties: mockProperties})
  };
  
  class MockUtils {
    confirmDialog(){
      return {
        afterClosed:()=>{
          return of(true);
        }
      }
    }
    showMessage(){}
  };

  const mockRouter = {};

  let generateRandomProperties = function(count:number):Array<Property>{
    let properties=new Array<Property>(count);
    for(let i=0;i<count;i++){
      properties[i]={
        id:i,
        userId:i,
        propertyname:randomString.generate(7),
        creationtime:randomString.generate(7),
        addressline_1:randomString.generate(7),
        addressline_2:randomString.generate(7),
        city:randomString.generate(7),
        postal:randomString.generate(4)
      }
    }
    return properties;
  }

  beforeEach(async () => {
    propertySpy = jasmine.createSpyObj('PropertyService', ['getTotalPropertyCount', 'getProperties', 'deleteProperties', 'deleteProperty']);
    propertySpy.getTotalPropertyCount.and.returnValue(of(2));
    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, BrowserAnimationsModule, ShareModule, CommonModule],
      declarations: [ PropertyComponent ],
      providers: [
        {provide:ActivatedRoute, useValue:mockActivatedRoute}, 
        {provide:PropertyService, useValue:propertySpy}, 
        {provide:Utils, useClass:MockUtils}, 
        {provide:Router, useValue:mockRouter}]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PropertyComponent);
    loader = TestbedHarnessEnvironment.loader(fixture);
    component = fixture.componentInstance;
    de = fixture.debugElement;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  it('should load initial properties to the data source', ()=>{
    expect(component.dataSource.data.length).toBe(2);
  });

  it('should have correct rows', ()=>{
    const rowHtmlElements = de.nativeElement.querySelectorAll('tbody tr');
    expect(rowHtmlElements.length).toBe(2);
  });

  it('should have correct values', ()=>{
    const rowHtmlElements = de.nativeElement.querySelectorAll('tbody tr');
    let propertyDataCell=rowHtmlElements[0].querySelectorAll('.mat-cell');
    expect(propertyDataCell[1].innerText).toBe('Cite');
    expect(propertyDataCell[2].innerText).toBe('10B, Place');
    expect(propertyDataCell[3].innerText).toBe('N/A');
    expect(propertyDataCell[4].innerText).toBe('Vitry');
    expect(propertyDataCell[5].innerText).toBe('94400');
    expect(propertyDataCell[6].innerText).toBe('Aug 06, 2020');
    propertyDataCell=rowHtmlElements[1].querySelectorAll('.mat-cell');
    expect(propertyDataCell[1].innerText).toBe('cite 1');
    expect(propertyDataCell[2].innerText).toBe('10B, Plac1');
    expect(propertyDataCell[3].innerText).toBe('123');
    expect(propertyDataCell[4].innerText).toBe('Vitr1');
    expect(propertyDataCell[5].innerText).toBe('94401');
    expect(propertyDataCell[6].innerText).toBe('Aug 06, 2021');
  });

  it('should show correct property count', ()=>{
    const propertyNav=de.nativeElement.querySelectorAll('.mat-paginator-range-label');
    expect(propertyNav[0].innerText).toBe('1 – 2 of 2');
  });

  it('empty search should set empty data source', fakeAsync(()=>{
    propertySpy.getProperties.and.returnValue(of([]));
    component.searchQuery.setValue("check");
    tick(500);
    fixture.detectChanges();
    expect(component.dataSource.data.length).toBe(0);
  }));

  it('empty search should render "No properties found message"', fakeAsync(()=>{
    propertySpy.getProperties.and.returnValue(of([]));
    component.searchQuery.setValue("check");
    tick(500);
    fixture.detectChanges();
    const rowHtmlElements = de.nativeElement.querySelectorAll('tbody tr');
    let propertyDataCell=rowHtmlElements[0].querySelectorAll('.mat-cell');
    expect(propertyDataCell[0].innerText).toBe('No properties found for the given criteria.'); 
  }));

  it('should show zero property count', fakeAsync(()=>{
    propertySpy.getProperties.and.returnValue(of([]));
    propertySpy.getTotalPropertyCount.and.returnValue(of(0));
    tick(500);
    fixture.detectChanges();
    const propertyNav=de.nativeElement.querySelectorAll('.mat-paginator-range-label');
    expect(propertyNav[0].innerText).toBe('0 of 0');
  }));

  it('search should call API with correct parameters', fakeAsync(()=>{
    propertySpy.getProperties.and.returnValue(of([mockProperties[0]]));
    component.searchQuery.setValue("check");
    tick(500);
    expect(propertySpy.getProperties).toHaveBeenCalledWith(jasmine.objectContaining(
      {pageIndex:0, pageSize:50, searchQuery:'check', countRequired:true})
      );
  }));

  it('search should show single property', fakeAsync(()=>{
    propertySpy.getProperties.and.returnValue(of([mockProperties[0]]));
    component.searchQuery.setValue("check");
    tick(500);
    fixture.detectChanges();
    const rowHtmlElements = de.nativeElement.querySelectorAll('tbody tr');
    expect(rowHtmlElements.length).toBe(1);
  }));

  it('search should render correct value', fakeAsync(()=>{
    propertySpy.getProperties.and.returnValue(of([mockProperties[1]]));
    component.searchQuery.setValue("check");
    tick(500);
    fixture.detectChanges();
    const rowHtmlElements = de.nativeElement.querySelectorAll('tbody tr');
    let propertyDataCell=rowHtmlElements[0].querySelectorAll('.mat-cell');
    expect(propertyDataCell[1].innerText).toBe('cite 1');
    expect(propertyDataCell[2].innerText).toBe('10B, Plac1');
    expect(propertyDataCell[3].innerText).toBe('123');
    expect(propertyDataCell[4].innerText).toBe('Vitr1');
    expect(propertyDataCell[5].innerText).toBe('94401');
    expect(propertyDataCell[6].innerText).toBe('Aug 06, 2021');
  }));

  it('should select all properties and enable delete button', async()=>{
    const randomProperties=generateRandomProperties(5);
    component.dataSource.loadProperties(randomProperties);
    fixture.detectChanges();

    const checkbox = await loader.getHarness(MatCheckboxHarness);
    await checkbox.check();
   
    expect(de.nativeElement.querySelectorAll('button')[1].disabled).toBeFalsy();   
  });

  it('should select all properties, call bulk delete method and refresh properties table', fakeAsync(async ()=>{
    const randomProperties=generateRandomProperties(5);
    component.dataSource.loadProperties(randomProperties);
    fixture.detectChanges();
    const checkbox = await loader.getHarness(MatCheckboxHarness);
    await checkbox.check();
    propertySpy.deleteProperties.and.returnValue(Promise.resolve(new HttpResponse<Object>()));
    propertySpy.getProperties.and.returnValue(of(randomProperties));

    const deleteButton = de.nativeElement.querySelectorAll('button')[1] as HTMLElement;
    deleteButton.click();

    tick();
    expect(propertySpy.deleteProperties).toHaveBeenCalledOnceWith([0,1,2,3,4]);
    expect(propertySpy.getProperties).toHaveBeenCalledWith(jasmine.objectContaining({countRequired:true}));
  }));

  it('should call delete method and refresh properties table', fakeAsync(async ()=>{
    const randomProperties=generateRandomProperties(1);
    component.dataSource.loadProperties(randomProperties);
    fixture.detectChanges();
    propertySpy.deleteProperty.and.returnValue(Promise.resolve(new HttpResponse<Object>()));
    propertySpy.getProperties.and.returnValue(of(randomProperties));
    

    const editButton = de.query(By.css('button[name=property-delete]'));
    const mouseenter = new MouseEvent('click');
    editButton.nativeElement.dispatchEvent(mouseenter);
    
    tick();
    expect(propertySpy.deleteProperty).toHaveBeenCalledOnceWith(randomProperties[0].id);
    expect(propertySpy.getProperties).toHaveBeenCalledWith(jasmine.objectContaining({countRequired:true}));
  }));

});

