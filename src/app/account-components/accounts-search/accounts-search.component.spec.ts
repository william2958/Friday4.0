import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountsSearchComponent } from './accounts-search.component';

describe('AccountsSearchComponent', () => {
  let component: AccountsSearchComponent;
  let fixture: ComponentFixture<AccountsSearchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AccountsSearchComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountsSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
