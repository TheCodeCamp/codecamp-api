import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditContestComponent } from './edit-contest.component';

describe('EditContestComponent', () => {
  let component: EditContestComponent;
  let fixture: ComponentFixture<EditContestComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditContestComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditContestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
