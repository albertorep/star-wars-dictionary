import { TestBed } from '@angular/core/testing';

import { SwapiDataService } from './swapi-data.service';

describe('SwapiDataService', () => {
  let service: SwapiDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SwapiDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
