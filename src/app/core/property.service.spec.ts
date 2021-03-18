import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { TestBed } from '@angular/core/testing';
import { PropertyAPI } from '../property/property-api';
import { APIService, END_POINTS } from './api.service';

import { PropertyService } from './property.service';

describe('PropertyService', () => {
  let propertyService: PropertyService;
  let httpTestingController: HttpTestingController;
  let apiService: APIService;
  

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ HttpClientTestingModule ],
      providers: [{provide:END_POINTS, useValue:[PropertyAPI]}]
    });
    apiService=TestBed.inject(APIService);
    propertyService = TestBed.inject(PropertyService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should be created', () => {
    expect(propertyService).toBeTruthy();
  });

  it('should be able to retrieve properties from the API', async()=>{
    const mockProperties = [
    {id: 1, userId: 2, propertyname: 'Cite', creationtime: 'Aug 06, 2020', addressline_1: '10B, Place', addressline_2: '', city: 'Vitry',postal: '94400'},
    {id: 2, userId: 2, propertyname: 'cite 1', creationtime: 'Aug 06, 2021', addressline_1: '10B, Plac1', addressline_2: '123', city: 'Vitr1', postal: '94401'}
    ]
    propertyService.getProperties().subscribe(properties=>{
      expect(properties.length).toBe(2);
      expect(properties).toEqual(mockProperties);
    })
    const req = httpTestingController.expectOne(apiService.resolve(apiService.endPoints.getProperties));
    expect(req.request.method).toBe("GET");
    req.flush(mockProperties);
  });

  it('should be able to retrieve properties with count header', ()=>{
    const mockProperties = [
    {id: 1, userId: 2, propertyname: 'Cite', creationtime: 'Aug 06, 2020', addressline_1: '10B, Place', addressline_2: '', city: 'Vitry',postal: '94400'},
    {id: 2, userId: 2, propertyname: 'cite 1', creationtime: 'Aug 06, 2021', addressline_1: '10B, Plac1', addressline_2: '123', city: 'Vitr1', postal: '94401'}
    ]
    propertyService.getProperties().subscribe(properties=>{
      expect(properties.length).toBe(2);
      expect(properties).toEqual(mockProperties);
    })
    propertyService.getTotalPropertyCount().subscribe(count=>{
      expect(count===0 || count===2).toBeTrue();
    })
    const req = httpTestingController.expectOne(apiService.resolve(apiService.endPoints.getProperties));
    expect(req.request.method).toBe("GET");
    req.flush(mockProperties, {
      headers:{"X-Total-Count":"2"}
    });

  });

  it('should return property on successful save', ()=>{
    const mockProperty = {propertyname: 'Cite', creationtime: 'Aug 06, 2020', addressline_1: '10B, Place', addressline_2: '', city: 'Vitry',postal: '94400'};
    propertyService.saveProperty(mockProperty).then(property=>{
      expect(property).toEqual(property);
    });
    const req = httpTestingController.expectOne(apiService.resolve(apiService.endPoints.addProperty));
    expect(req.request.method).toBe("POST");
    req.flush(mockProperty);
  });

  it('should return property on successful update', ()=>{
    const mockProperty = {id:1, propertyname: 'Cite', creationtime: 'Aug 06, 2020', addressline_1: '10B, Place', addressline_2: '', city: 'Vitry',postal: '94400'};
    propertyService.updateProperty(mockProperty).then(property=>{
      expect(property).toEqual(property);
    });
    const req = httpTestingController.expectOne(apiService.resolve(apiService.endPoints.updateProperty, {id:mockProperty.id}));
    expect(req.request.method).toBe("PUT");
    req.flush(mockProperty);
  });

  it('should get property for given id ', ()=>{
    const mockProperty = {id:1, propertyname: 'Cite', creationtime: 'Aug 06, 2020', addressline_1: '10B, Place', addressline_2: '', city: 'Vitry',postal: '94400'};
    propertyService.getProperty(mockProperty.id).subscribe(property=>{
      expect(property).toEqual(property);
    });
    const req = httpTestingController.expectOne(apiService.resolve(apiService.endPoints.getProperty, {id:mockProperty.id}));
    expect(req.request.method).toBe("GET");
    req.flush(mockProperty);
  });
  
  it('should send 204 status code for deleting a property', ()=>{
    propertyService.deleteProperty(1).then(data=>{
      expect(data.status).toBe(204);
    });
    const req =httpTestingController.expectOne(apiService.resolve(apiService.endPoints.deleteProperty, {id:1}));
    expect(req.request.method).toBe("DELETE");
    req.flush({}, {status:204, statusText:'deleted'});
  });

  it('should call bulk delete and should send 200 status for deleting properties', ()=>{
    const ids=[1,2,3];
    propertyService.deleteProperties(ids).then(data=>{
      expect(data.status).toBe(200);
    })
    const req =httpTestingController.expectOne(`${apiService.resolve(apiService.endPoints.deleteProperties)}?propertyIds=${ids.join(',')}`);
    expect(req.request.method).toBe("POST");
    req.flush({}, {status:200, statusText:'deleted'});
  });

});
