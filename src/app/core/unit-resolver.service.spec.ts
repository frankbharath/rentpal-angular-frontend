import { TestBed } from '@angular/core/testing';

import { UnitResolverService } from './unit-resolver.service';

describe('UnitResolverService', () => {
  let service: UnitResolverService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UnitResolverService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
