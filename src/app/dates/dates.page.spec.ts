import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DatesPage } from './dates.page';

describe('DatesPage', () => {
  let component: DatesPage;
  let fixture: ComponentFixture<DatesPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DatesPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DatesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
