import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Error404componentComponent } from './error404component.component';

describe('Error404componentComponent', () => {
  let component: Error404componentComponent;
  let fixture: ComponentFixture<Error404componentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Error404componentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Error404componentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
