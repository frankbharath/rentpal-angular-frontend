import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { PropertyService } from '../core/property.service';
import { Utils } from '../share/utils';
import { of } from 'rxjs';

import { PropertyComponent } from './property.component';
import { Observable } from 'rxjs';
import { ShareModule } from '../share/share.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ReactiveFormsModule } from '@angular/forms';
import { DebugElement } from '@angular/core';

fdescribe('PropertyComponent', () => {
  let component: PropertyComponent;
  let fixture: ComponentFixture<PropertyComponent>;
  let de: DebugElement;
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
      creationtime: 'Aug 06, 2020',
      addressline_1: '10B, Place',
      addressline_2: '',
      city: 'Vitry',
      postal: '94400'
    }
  ]
  const mockActivatedRoute = {
    data: of({properties: mockProperties})
  };

  class MockPropertyService {
    getTotalPropertyCount():Observable<number>{
      return of(0);
    }
  }
  
  const mockUtils = {

  };

  const mockRouter = {

  };
  const paginator = jasmine.createSpyObj('MatPaginator', ['page']);
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, BrowserAnimationsModule, ShareModule],
      declarations: [ PropertyComponent ],
      providers: [
        {provide:ActivatedRoute, useValue:mockActivatedRoute}, 
        {provide:PropertyService, useClass:MockPropertyService}, 
        {provide:Utils, useValue:mockUtils}, 
        {provide:Router, useValue:mockRouter}]
    })
    .compileComponents();
    
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PropertyComponent);
    component = fixture.componentInstance;
    de = fixture.debugElement;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load properties to the data source', ()=>{
    expect(component.dataSource.data.length).toBe(2);
  });
  it('should have correct rows', ()=>{
    const rowHtmlElements = de.nativeElement.querySelectorAll('tbody tr');
    expect(rowHtmlElements.length).toBe(2);
  })
});
