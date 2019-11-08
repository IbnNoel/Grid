import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddLanguageCustomRfrComponent } from './add-language-custom-rfr.component';

describe('AddLanguageCustomRfrComponent', () => {
  let component: AddLanguageCustomRfrComponent;
  let fixture: ComponentFixture<AddLanguageCustomRfrComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddLanguageCustomRfrComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddLanguageCustomRfrComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
