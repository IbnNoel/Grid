import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditRfRI18NComponent } from './edit-rf-ri18-n.component';

describe('EditRfRI18NComponent', () => {
  let component: EditRfRI18NComponent;
  let fixture: ComponentFixture<EditRfRI18NComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditRfRI18NComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditRfRI18NComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
