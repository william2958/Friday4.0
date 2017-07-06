import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NotesPaginationComponent } from './notes-option-bar.component';

describe('NotesPaginationComponent', () => {
  let component: NotesPaginationComponent;
  let fixture: ComponentFixture<NotesPaginationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NotesPaginationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NotesPaginationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
