import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IdeSubmitComponent } from './ide-submit.component';

describe('IdeSubmitComponent', () => {
  let component: IdeSubmitComponent;
  let fixture: ComponentFixture<IdeSubmitComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IdeSubmitComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IdeSubmitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
