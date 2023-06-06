import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { ChatItemPosition, ContentType, MessageType } from '@app/enums';
import { ChatItem } from '@app/interface/chat';

@Component({
  selector: 'app-chat-item',
  templateUrl: './chat-item.component.html',
  styleUrls: ['./chat-item.component.scss']
})
export class ChatItemComponent implements OnInit {
  // @ts-ignore
  @ViewChild('audioPlayer') audioPlayer: ElementRef<HTMLAudioElement>;

  @Input() item: ChatItem | null = null; 

  public  chatItemPositionKeys = ChatItemPosition;
  
  public messageTypeKey = MessageType;

  public contentTypeKey = ContentType;

  public audioSource: string | null = null;

  public totalTime: string = "";

  constructor() { }

  ngOnInit(): void {
    if(this.item?.audio && this.item.messageType === MessageType.SENT) {
      this.updateAudioBlob(this.item.audio as Blob)
    }
  }

  ngAfterViewInit() {
    if(!(this.item?.audio && this.item.messageType === MessageType.SENT && this.totalTime)) {
      return;
    }
    this.audioPlayer.nativeElement.addEventListener('loadedmetadata', () => {
      this.totalTime = this.formatTime(this.audioPlayer.nativeElement.duration);
      this.audioPlayer.nativeElement.load();
      this.audioPlayer.nativeElement.play();
      this.audioPlayer.nativeElement.pause();
      this.audioPlayer.nativeElement.currentTime = 0;
    });
  }

  private formatTime(time: number): string {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  }

  /**
   * 
   */
  get chatItemPosition(): ChatItemPosition | null {
    if(!this.item) {
      return null;
    }
    if(this.item.messageType === MessageType.RECEIVED ) {
      return ChatItemPosition.LEFT;
    }
    return ChatItemPosition.RIGHT;
  }

  /**
   * 
   * @param blob 
   */
  private updateAudioBlob(blob: Blob) {
    const reader = new FileReader();
    reader.onload = (event => {
      if (event.target && typeof event.target.result === 'string') {
        this.audioSource = event.target.result;
      }
    });

    reader.readAsDataURL(blob);
  }

}