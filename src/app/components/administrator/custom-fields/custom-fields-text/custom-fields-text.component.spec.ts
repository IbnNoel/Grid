import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomFieldsTextComponent } from './custom-fields-text.component';

describe('CustomFieldsTextComponent', () => {
  let component: CustomFieldsTextComponent;
  let fixture: ComponentFixture<CustomFieldsTextComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CustomFieldsTextComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomFieldsTextComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
