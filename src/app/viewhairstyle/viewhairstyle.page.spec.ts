import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewhairstylePage } from './viewhairstyle.page';

describe('ViewhairstylePage', () => {
  let component: ViewhairstylePage;
  let fixture: ComponentFixture<ViewhairstylePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewhairstylePage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewhairstylePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
