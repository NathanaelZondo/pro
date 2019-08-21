import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BookwithsalonPage } from './bookwithsalon.page';

describe('BookwithsalonPage', () => {
  let component: BookwithsalonPage;
  let fixture: ComponentFixture<BookwithsalonPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BookwithsalonPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BookwithsalonPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
