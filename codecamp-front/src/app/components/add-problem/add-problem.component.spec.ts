import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddProblemComponent } from './add-problem.component';

describe('AddProblemComponent', () => {
  let component: AddProblemComponent;
  let fixture: ComponentFixture<AddProblemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddProblemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddProblemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
