import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DirectRejectRequestComponent } from './direct-reject-request.component';

describe('DirectRejectRequestComponent', () => {
  let component: DirectRejectRequestComponent;
  let fixture: ComponentFixture<DirectRejectRequestComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DirectRejectRequestComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DirectRejectRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
