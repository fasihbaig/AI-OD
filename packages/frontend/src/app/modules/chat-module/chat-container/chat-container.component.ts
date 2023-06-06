import { Component, OnInit } from '@angular/core';
import { ContentType, MessageType } from '@app/enums';
import { ChatItem } from '@app/interface/chat';
import { LocalStorageService } from '@app/services';

@Component({
  selector: 'app-chat-container',
  templateUrl: './chat-container.component.html',
  styleUrls: ['./chat-container.component.scss']
})
export class ChatContainerComponent implements OnInit {
  public chatList: ChatItem[] = [];

  constructor(
    private localStorageService: LocalStorageService
  ) { }

  ngOnInit(): void {

  }

  onClearChat() {
    this.chatList = [];
    this.localStorageService.setSessionId(true)
  }

}
