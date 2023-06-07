import { Component, ElementRef, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { RecordingService } from '@app/services';
import { BAR_HEIGHT, MAX_AMPLITUDE } from './constants';
import { ContentType, MessageType, RecordingStatus } from '@app/enums';
import { convertFileToBase64Promise, scaleValue } from 'src/common';

import { ChatItem } from '@app/interface/chat';

@Component({
  selector: 'app-audio-recording-panel',
  templateUrl: './audio-recording-panel.component.html',
  styleUrls: ['./audio-recording-panel.component.scss']
})
export class AudioRecordingPanelComponent implements OnInit {

  @Output() onRecordingStatusChange: EventEmitter<RecordingStatus> = new EventEmitter<RecordingStatus>();

  @Output() sendAudioChat: EventEmitter<ChatItem> = new EventEmitter<ChatItem>();
  
  public audioRecordingStarted: boolean = false;

  public recordingBars: { active: boolean, amplitude: number }[] = [];
  
  constructor(private recordingService: RecordingService ) { }

  public recordingStatus = RecordingStatus.STOPPED;

  public recordingStatusKeys = RecordingStatus;

  public timeElapse = "00:00";

  public timeElapseIntervalInstance: NodeJS.Timer | null = null;

  ngOnInit(): void {
  }

  /**
   * 
   */
  changeRecordingStatus() {
     if(this.recordingStatus === RecordingStatus.STOPPED) {
       this.recordAudio();
     } else {
       const subscription = this.recordingService.stopRecording().subscribe({
        next: async (audioRecordingWebmFile: Blob) => {
          console.log("Recording ended");
          this.recordingBars = [];
          this.recordingStatus = RecordingStatus.STOPPED;
          this.onRecordingStatusChange.emit(this.recordingStatus);
          if(this.timeElapseIntervalInstance) {
            clearInterval(this.timeElapseIntervalInstance);
          }
          const file = await convertFileToBase64Promise(audioRecordingWebmFile);
           this.sendAudioChat.emit({
            id: -1,
            date: new Date(),
            username: "",
            contentType: ContentType.AUDIO,
            message: "",
            messageType: MessageType.SENT,
            file: file
          });
        },
        complete: () => {
          subscription.unsubscribe();
        }
       })
     }
  }

  resetData() {
    this.recordingBars = [];
    this.timeElapse = "00:00";
    this.recordingStatus = RecordingStatus.STOPPED;
    if(this.timeElapseIntervalInstance) {
      clearInterval(this.timeElapseIntervalInstance);
    }
  }

  /**
   * function to start recording
   */
  recordAudio() {
    const subscription =  this.recordingService.startVoiceRecording().subscribe( {
      next: ({type, value}) => {
        if(type === "voice_detection") {
          this.recordingBars.unshift({ active: true, amplitude: scaleValue(value > MAX_AMPLITUDE? MAX_AMPLITUDE: value, 0, 100, 0, BAR_HEIGHT)});
        } else {
          this.recordingStatus = RecordingStatus.RECORDING;
          this.onRecordingStatusChange.emit(this.recordingStatus);
          this.timeElapseIntervalInstance = this.startTimer();
        }
      },
      error: (error: Error) => {
        this.audioRecordingStarted = false;
        window.alert("Unable to start audion recording.");
        subscription.unsubscribe()
      },
      complete: () => {
        subscription.unsubscribe();
      }
    })
  }

  /**
   * 
   * @returns 
   */
  startTimer(): NodeJS.Timer {
    const startTime = new Date().getTime(); // Get the current timestamp
    
    const that = this;
    const timer = setInterval(function() {
      const currentTime = new Date().getTime(); // Get the current timestamp
      const elapsedTime = currentTime - startTime; // Calculate the elapsed time in milliseconds
  
      // Convert the elapsed time to hours, minutes, seconds, and milliseconds
      const hours = Math.floor(elapsedTime / (1000 * 60 * 60));
      const minutes = Math.floor((elapsedTime % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((elapsedTime % (1000 * 60)) / 1000);
  
      that.timeElapse = 
      hours > 0? (hours.toString().padStart(2, '0') + ':') : "" +
          minutes.toString().padStart(2, '0') +
          ':' +
          seconds.toString().padStart(2, '0') 
    }, 100); // Update the counter every 10 milliseconds
  
    return timer; // Return the timer ID to allow stopping the timer later if needed
  }

  cancelRecording() {
    this.recordingService.cancelRecording();
    this.resetData();
    this.onRecordingStatusChange.emit(this.recordingStatus);
  }
}
