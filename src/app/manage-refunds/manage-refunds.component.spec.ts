import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageRefundsComponent } from './manage-refunds.component';

describe('ManageRefundsComponent', () => {
  let component: ManageRefundsComponent;
  let fixture: ComponentFixture<ManageRefundsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManageRefundsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageRefundsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
