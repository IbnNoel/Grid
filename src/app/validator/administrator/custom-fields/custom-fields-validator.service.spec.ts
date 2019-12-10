import { TestBed } from '@angular/core/testing';

import { CustomFieldsValidatorService } from './custom-fields-validator.service';

describe('CustomFieldsValidatorService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CustomFieldsValidatorService = TestBed.get(CustomFieldsValidatorService);
    expect(service).toBeTruthy();
  });
});
