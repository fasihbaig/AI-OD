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

  onRecordingStatusChange(recordingStatus: RecordingStatus): void {
    this.recordingStatus = recordingStatus;
  }

  async sendAudioChat(item: ChatItem) {
    this.chatList.push(item);
    const file = await this.convertFileToBase64Promise(item.message as File)
    this.subscriptions.push(
      this.chatService.postChat({...item, file}).subscribe({
        next: (res) => {
          if(res) {
            this.chatList.push(res)
          }
        }
      })
    )
  }

  convertFileToBase64Promise(inputFile: Blob): Promise<{data: string, name: string}> {
    return new Promise((resolve, reject) => {
      if (!inputFile) {
        return reject(new Error("No valid file was provided"));
      }

      let base64documentString: string;
      const reader = new FileReader();
      reader.readAsDataURL(inputFile);

      const resultantFile: {data: string, name: string, type: string} = {
        name: "n/a",
        data: "",
        type: inputFile.type
      };

      reader.addEventListener("load", (event: ProgressEvent) => {
        const binaryString = (event.target as FileReader).result as ArrayBuffer;
        //if(reader.result)
        base64documentString = reader.result as string; // (reader.result as string).split(',')[1]; //btoa(binaryString.toString());
      });

      reader.onloadend = (): void => {
        resultantFile.data = base64documentString;
        resultantFile.name = inputFile.name;
        return resolve(resultantFile);
      };

      reader.addEventListener("error", (error): void => {
        return reject(error);
      });
    });
  }

  get isRecordingChat(): boolean {
    return  [RecordingStatus.RECORDING, RecordingStatus.PAUSED].includes(this.recordingStatus)
  }

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
