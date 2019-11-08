import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddLanguageCustomRfrChildComponent } from './add-language-custom-rfr-child.component';

describe('AddLanguageCustomRfrChildComponent', () => {
  let component: AddLanguageCustomRfrChildComponent;
  let fixture: ComponentFixture<AddLanguageCustomRfrChildComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddLanguageCustomRfrChildComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddLanguageCustomRfrChildComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
