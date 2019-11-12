import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddCustomRefundSettingComponent } from './add-custom-refund-setting.component';

describe('AddCustomRefundSettingComponent', () => {
  let component: AddCustomRefundSettingComponent;
  let fixture: ComponentFixture<AddCustomRefundSettingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddCustomRefundSettingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddCustomRefundSettingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
