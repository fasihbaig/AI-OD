import { Component, Input, OnInit } from '@angular/core';
import { ContentType, MessageType, RecordingStatus } from '@app/enums';
import { ChatItem } from '@app/interface/chat';
import { RecordingService } from '@app/services';

@Component({
  selector: 'app-chat-form',
  templateUrl: './chat-form.component.html',
  styleUrls: ['./chat-form.component.scss']
})
export class ChatFormComponent implements OnInit {
 
  @Input() chatList: ChatItem[] = [];

  public chatText: string = "";

  public recordingStatus: RecordingStatus = RecordingStatus.STOPPED;

  public recordingStatusKeys = RecordingStatus;

  constructor(
    private recordingService: RecordingService
  ) { }

  ngOnInit(): void {
  }


  /**
   * function to send text chat
   * @param value 
   */
  sendChat() {
    this.chatList.push({
      id: -1,
      contentType: ContentType.TEXT,
      message: this.chatText,
      date: new Date(),
      messageType: MessageType.SENT,
      image: null,
      username: ""
    });
    this.chatText = "";
  }

  get isMediaServicesAvailable(): boolean {
    return this.recordingService.checkRecordingPossible();
  }

  onRecordingStatusChange(recordingStatus: RecordingStatus): void {
    this.recordingStatus = recordingStatus;
  }

  sendAudioChat(item: ChatItem) {
    this.chatList.push(item);
  }

  get isRecordingChat(): boolean {
    return  [RecordingStatus.RECORDING, RecordingStatus.PAUSED].includes(this.recordingStatus)
  }

}
