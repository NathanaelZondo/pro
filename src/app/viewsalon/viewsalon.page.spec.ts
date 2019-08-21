import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewsalonPage } from './viewsalon.page';

describe('ViewsalonPage', () => {
  let component: ViewsalonPage;
  let fixture: ComponentFixture<ViewsalonPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewsalonPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewsalonPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
