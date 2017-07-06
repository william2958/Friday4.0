import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountsOptionBarComponent } from './accounts-option-bar.component';

describe('AccountsOptionBarComponent', () => {
  let component: AccountsOptionBarComponent;
  let fixture: ComponentFixture<AccountsOptionBarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AccountsOptionBarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountsOptionBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
