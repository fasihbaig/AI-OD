import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { ContentType, MessageType, RecordingStatus } from '@app/enums';
import { ChatItem } from '@app/interface/chat';
import { ChatService, RecordingService } from '@app/services';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-chat-form',
  templateUrl: './chat-form.component.html',
  styleUrls: ['./chat-form.component.scss']
})
export class ChatFormComponent implements OnInit, OnDestroy {
 
  @Input() chatList: ChatItem[] = [];

  public chatText: string = "";

  public recordingStatus: RecordingStatus = RecordingStatus.STOPPED;

  public recordingStatusKeys = RecordingStatus;

  private subscriptions: Subscription[] = []

  constructor(
    private recordingService: RecordingService,
    private chatService: ChatService
  ) { }

  ngOnInit(): void {
  }


  /**
   * function to send text chat
   * @param value 
   */
  sendChat() {
    const chantItem = {
      id: -1,
      contentType: ContentType.TEXT,
      message: this.chatText,
      date: new Date(),
      messageType: MessageType.SENT,
      image: null,
      username: ""
    }
    this.chatList.push(chantItem);
    this.chatService.postChat(chantItem).subscribe({
      next: (res) => {
        console.log(res)
      }
    })
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
    this.subscriptions.push(
      this.chatService.postChat(item).subscribe({
        next: (res) => {
          console.log(res)
        }
      })
    )
  }

  get isRecordingChat(): boolean {
    return  [RecordingStatus.RECORDING, RecordingStatus.PAUSED].includes(this.recordingStatus)
  }

  ngOnDestroy() {
    this.subscriptions.forEach(subscriber => {
      subscriber.unsubscribe()
    })
  }

}
