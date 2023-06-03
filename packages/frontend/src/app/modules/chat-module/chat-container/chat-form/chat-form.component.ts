import { Component, Input, OnInit } from '@angular/core';
import { RecordingService } from '@app/services';

@Component({
  selector: 'app-chat-form',
  templateUrl: './chat-form.component.html',
  styleUrls: ['./chat-form.component.scss']
})
export class ChatFormComponent implements OnInit {
 
  @Input() chatList: any[] = [];

  public chatText: string = "";

  constructor(
    private recordingService: RecordingService
  ) { }

  ngOnInit(): void {
  }


  /**
   * function to send text chat
   * @param value 
   */
  sendChat(value: any) {
    this.chatList.push({message: this.chatText, type: "text"});
    this.chatText = "";
  }

  get isMediaServicesAvailable(): boolean {
    return this.recordingService.checkRecordingPossible();
  }

}
