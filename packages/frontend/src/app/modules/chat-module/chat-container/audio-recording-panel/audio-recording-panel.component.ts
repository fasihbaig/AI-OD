import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { RecordingService } from '@app/services';
import { MAX_AMPLITUDE } from './constants';

@Component({
  selector: 'app-audio-recording-panel',
  templateUrl: './audio-recording-panel.component.html',
  styleUrls: ['./audio-recording-panel.component.scss']
})
export class AudioRecordingPanelComponent implements OnInit {
 // @ViewChild('audioElement') audioElement: ElementRef;
  public audioRecordingStarted: boolean = false;
  public recordingBars: { active: boolean, amplitude: number }[] = [];
  constructor(private recordingService: RecordingService ) { }

  ngOnInit(): void {
  }

  /**
   * function to start recording
   */
  recordAudio() {
    this.recordingService.startVoiceRecording().subscribe( {
      next: ({type, value}) => {
        if(type === "voice_detection") {
          const height = value / 2;
          this.recordingBars.push({ active: true, amplitude: height > MAX_AMPLITUDE?MAX_AMPLITUDE: height });
        }
      },
      error: (error: Error) => {
        this.audioRecordingStarted = false;
        window.alert("Unable to start audion recording.");
        console.log(error);
      }
    })
  }
}
