import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QuicknoteComponent } from './quicknote.component';

describe('QuicknoteComponent', () => {
  let component: QuicknoteComponent;
  let fixture: ComponentFixture<QuicknoteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QuicknoteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QuicknoteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
