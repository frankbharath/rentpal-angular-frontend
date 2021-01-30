import { TestBed } from '@angular/core/testing';

import { PropertyResolverService } from './property-resolver.service';

describe('PropertyResolverService', () => {
  let service: PropertyResolverService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PropertyResolverService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
