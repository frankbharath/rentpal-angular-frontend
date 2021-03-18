import { TestBed } from '@angular/core/testing';
import { PropertyAPI } from '../property/property-api';
import { APIService, END_POINTS } from './api.service';

describe('APIService', () => {
  let apiService: APIService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers:[{provide:END_POINTS, useValue:[PropertyAPI]}]
    });
    apiService = TestBed.inject(APIService);
  });

  it('should be created', () => {
    expect(apiService).toBeTruthy();
  });
});
