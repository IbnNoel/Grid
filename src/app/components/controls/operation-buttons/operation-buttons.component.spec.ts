import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OperationButtonsComponent } from './operation-buttons.component';

describe('OperationButtonsComponent', () => {
  let component: OperationButtonsComponent;
  let fixture: ComponentFixture<OperationButtonsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OperationButtonsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OperationButtonsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
