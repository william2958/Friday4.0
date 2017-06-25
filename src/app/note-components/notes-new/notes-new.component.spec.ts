import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NotesNewComponent } from './notes-new.component';

describe('NotesNewComponent', () => {
  let component: NotesNewComponent;
  let fixture: ComponentFixture<NotesNewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NotesNewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NotesNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
