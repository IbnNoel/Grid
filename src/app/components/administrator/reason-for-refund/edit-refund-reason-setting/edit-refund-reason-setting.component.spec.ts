import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditRefundReasonSettingComponent } from './edit-refund-reason-setting.component';

describe('EditRefundReasonSettingComponent', () => {
  let component: EditRefundReasonSettingComponent;
  let fixture: ComponentFixture<EditRefundReasonSettingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditRefundReasonSettingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditRefundReasonSettingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
