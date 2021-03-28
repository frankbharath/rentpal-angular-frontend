import { TestBed } from '@angular/core/testing';

import { DashbordResolverService } from './dashbord-resolver.service';

describe('DashbordResolverService', () => {
  let service: DashbordResolverService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DashbordResolverService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
