import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReasonForRefundComponent } from './reason-for-refund.component';

describe('ReasonForRefundComponent', () => {
  let component: ReasonForRefundComponent;
  let fixture: ComponentFixture<ReasonForRefundComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReasonForRefundComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReasonForRefundComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
