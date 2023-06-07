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

  private subscriptions: Subscription[] = [];

  private loadingChatItem = {
      id: -1,
      contentType: ContentType.LOADING,
      message: this.chatText,
      date: new Date(),
      messageType: MessageType.RECEIVED,
      image: null,
      username: ""
  }

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
    this.chatList.push(this.loadingChatItem);
    this.chatService.postChat(chantItem).subscribe({
      next: (res) => {
        this.removeLoadingChatItem();
        if(!res) {
          return;
        }
        this.chatList.push({
          id: res.id,
          message: res.message,
          contentType: ContentType.TEXT,
          messageType: MessageType.RECEIVED
        } as ChatItem);
      }
    })
    this.chatText = "";
  }

  get isMediaServicesAvailable(): boolean {
    return this.recordingService.checkRecordingPossible();
  }

  /**
   * 
   * @param recordingStatus 
   */
  onRecordingStatusChange(recordingStatus: RecordingStatus): void {
    this.recordingStatus = recordingStatus;
  }

  /**
   * 
   * @param item 
   */
  async sendAudioChat(item: ChatItem) {
    item.message = "";
    this.chatList.push(item);
   this.chatList.push(this.loadingChatItem);
    this.subscriptions.push(
      this.chatService.postChat({...item}).subscribe({
        next: (res) => {
          this.removeLoadingChatItem();
          if(res) {
            this.chatList.push(res)
          }
        }
      })
    )
  }

  get isRecordingChat(): boolean {
    return  [RecordingStatus.RECORDING, RecordingStatus.PAUSED].includes(this.recordingStatus)
  }

  /**
   * 
   */
  removeLoadingChatItem() {
    const index =  this.chatList.findIndex(item => item.contentType === ContentType.LOADING)
      if(index > -1) {
        this.chatList.splice(index, 1);
      }
  }

  ngOnDestroy() {
    this.subscriptions.forEach(subscriber => {
      subscriber.unsubscribe()
    })
  }
}
