import { TestBed } from '@angular/core/testing';

import { ReasonForRefundValidatorService } from './reason-for-refund-validator.service';

describe('ReasonForRefundValidatorService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ReasonForRefundValidatorService = TestBed.get(ReasonForRefundValidatorService);
    expect(service).toBeTruthy();
  });
});
