import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RanklistComponent } from './ranklist.component';

describe('RanklistComponent', () => {
  let component: RanklistComponent;
  let fixture: ComponentFixture<RanklistComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RanklistComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RanklistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
