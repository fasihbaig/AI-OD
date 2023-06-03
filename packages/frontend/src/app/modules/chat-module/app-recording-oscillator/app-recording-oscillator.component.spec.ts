import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppRecordingOscillatorComponent } from './app-recording-oscillator.component';

describe('AppRecordingOscillatorComponent', () => {
  let component: AppRecordingOscillatorComponent;
  let fixture: ComponentFixture<AppRecordingOscillatorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AppRecordingOscillatorComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AppRecordingOscillatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
