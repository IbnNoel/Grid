import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GpfiModalComponent } from './gpfi-modal.component';

describe('GpfiModalComponent', () => {
  let component: GpfiModalComponent;
  let fixture: ComponentFixture<GpfiModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GpfiModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GpfiModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
