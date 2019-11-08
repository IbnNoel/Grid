import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddCustomRefundReasonComponent } from './add-custom-refund-reason.component';

describe('AddCustomRefundReasonComponent', () => {
  let component: AddCustomRefundReasonComponent;
  let fixture: ComponentFixture<AddCustomRefundReasonComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddCustomRefundReasonComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddCustomRefundReasonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
