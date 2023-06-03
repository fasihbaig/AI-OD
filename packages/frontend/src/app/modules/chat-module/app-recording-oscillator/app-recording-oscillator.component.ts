import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { RecordingService } from '@app/services';

@Component({
  selector: 'app-app-recording-oscillator',
  templateUrl: './app-recording-oscillator.component.html',
  styleUrls: ['./app-recording-oscillator.component.scss']
})
export class AppRecordingOscillatorComponent implements OnInit, OnDestroy {
  recordingBars: { active: boolean }[] = [];
  recordingInterval: any;

  constructor() { }

  ngOnInit() {
    this.startRecording();
  }

  ngOnDestroy() {
    this.stopRecording();
  }

  startRecording() {
    this.recordingInterval = setInterval(() => {
      
    }, 200); // Adjust the interval time (in milliseconds) between each recording bar creation
  }

  stopRecording() {
    clearInterval(this.recordingInterval);
  }
}
