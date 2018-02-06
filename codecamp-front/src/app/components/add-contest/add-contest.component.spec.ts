import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddContestComponent } from './add-contest.component';

describe('AddContestComponent', () => {
  let component: AddContestComponent;
  let fixture: ComponentFixture<AddContestComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddContestComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddContestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
