import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StartTestComponent } from './start-test';

describe('StartTest', () => {
  let component: StartTestComponent;
  let fixture: ComponentFixture<StartTestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StartTestComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(StartTestComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
