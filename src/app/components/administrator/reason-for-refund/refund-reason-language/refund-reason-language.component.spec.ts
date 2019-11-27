import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RefundReasonLanguageComponent } from './refund-reason-language.component';

describe('AddLanguageCustomRfrChildComponent', () => {
  let component: RefundReasonLanguageComponent;
  let fixture: ComponentFixture<RefundReasonLanguageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RefundReasonLanguageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RefundReasonLanguageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
