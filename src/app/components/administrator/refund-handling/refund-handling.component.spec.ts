import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RefundHandlingComponent } from './refund-handling.component';

describe('RefundHandlingComponent', () => {
  let component: RefundHandlingComponent;
  let fixture: ComponentFixture<RefundHandlingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RefundHandlingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RefundHandlingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
