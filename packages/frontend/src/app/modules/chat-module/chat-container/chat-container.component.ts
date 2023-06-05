import { Component, OnInit } from '@angular/core';
import { ContentType, MessageType } from '@app/enums';
import { ChatItem } from '@app/interface/chat';

@Component({
  selector: 'app-chat-container',
  templateUrl: './chat-container.component.html',
  styleUrls: ['./chat-container.component.scss']
})
export class ChatContainerComponent implements OnInit {
  public chatList: ChatItem[] = [];
  
  constructor() { }

  ngOnInit(): void {

  }

  onClearChat() {
    this.chatList = [];
  }

}
