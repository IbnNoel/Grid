import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RefundReasonSettingComponent } from './refund-reason-setting.component';

describe('AddCustomRefundSettingComponent', () => {
  let component: RefundReasonSettingComponent;
  let fixture: ComponentFixture<RefundReasonSettingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RefundReasonSettingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RefundReasonSettingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
