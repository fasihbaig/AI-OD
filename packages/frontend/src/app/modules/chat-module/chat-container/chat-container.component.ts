import { Component, OnInit } from '@angular/core';
import { ContentType, MessageType } from '@app/enums';
import { ChatItem } from '@app/interface/chat';

@Component({
  selector: 'app-chat-container',
  templateUrl: './chat-container.component.html',
  styleUrls: ['./chat-container.component.scss']
})
export class ChatContainerComponent implements OnInit {
  public chatList: ChatItem[] = [ 
    { 
      contentType: ContentType.TEXT,
      message: "where do you want to go?", 
      id: 1,
      date: new Date(),
      messageType: MessageType.RECEIVED,
      image: null,
      username: "user"
    },
    { 
      contentType: ContentType.TEXT,
      message: "where do you want to go?", 
      id: 1,
      date: new Date(),
      messageType: MessageType.RECEIVED,
      image: null,
      username: "user"
    },
    { 
      contentType: ContentType.TEXT,
      message: "where do you want to go?", 
      id: 1,
      date: new Date(),
      messageType: MessageType.RECEIVED,
      image: null,
      username: "user"
    },
    { 
      contentType: ContentType.TEXT,
      message: `
      123 sdlkfjsldkj sdfklsdjf lkjlsd lsdfjsldkfj sdflksdjflskjf sdflskdjflsdkj lfjslfjk sldkfj lkjsdlfjsdlfjkl
      123 sdlkfjsldkj sdfklsdjf lkjlsd lsdfjsldkfj sdflksdjflskjf sdflskdjflsdkj lfjslfjk sldkfj lkjsdlfjsdlfjkl
      123 sdlkfjsldkj sdfklsdjf lkjlsd lsdfjsldkfj sdflksdjflskjf sdflskdjflsdkj lfjslfjk sldkfj lkjsdlfjsdlfjkl
      123 sdlkfjsldkj sdfklsdjf lkjlsd lsdfjsldkfj sdflksdjflskjf sdflskdjflsdkj lfjslfjk sldkfj lkjsdlfjsdlfjkl
      123 sdlkfjsldkj sdfklsdjf lkjlsd lsdfjsldkfj sdflksdjflskjf sdflskdjflsdkj lfjslfjk sldkfj lkjsdlfjsdlfjkl
      123 sdlkfjsldkj sdfklsdjf lkjlsd lsdfjsldkfj sdflksdjflskjf sdflskdjflsdkj lfjslfjk sldkfj lkjsdlfjsdlfjkl
      123 sdlkfjsldkj sdfklsdjf lkjlsd lsdfjsldkfj sdflksdjflskjf sdflskdjflsdkj lfjslfjk sldkfj lkjsdlfjsdlfjkl
      123 sdlkfjsldkj sdfklsdjf lkjlsd lsdfjsldkfj sdflksdjflskjf sdflskdjflsdkj lfjslfjk sldkfj lkjsdlfjsdlfjkl
      123 sdlkfjsldkj sdfklsdjf lkjlsd lsdfjsldkfj sdflksdjflskjf sdflskdjflsdkj lfjslfjk sldkfj lkjsdlfjsdlfjkl
      123 sdlkfjsldkj sdfklsdjf lkjlsd lsdfjsldkfj sdflksdjflskjf sdflskdjflsdkj lfjslfjk sldkfj lkjsdlfjsdlfjkl
      123 sdlkfjsldkj sdfklsdjf lkjlsd lsdfjsldkfj sdflksdjflskjf sdflskdjflsdkj lfjslfjk sldkfj lkjsdlfjsdlfjkl
      123 sdlkfjsldkj sdfklsdjf lkjlsd lsdfjsldkfj sdflksdjflskjf sdflskdjflsdkj lfjslfjk sldkfj lkjsdlfjsdlfjkl
      `, 
      id: 1,
      date: new Date(),
      messageType: MessageType.SENT,
      image: null,
      username: "user"
    },
    { 
      contentType: ContentType.TEXT,
      message: "where do you want to go?", 
      id: 1,
      date: new Date(),
      messageType: MessageType.RECEIVED,
      image: null,
      username: "user"
    },
    { 
      contentType: ContentType.TEXT,
      message: "where do you want to go?", 
      id: 1,
      date: new Date(),
      messageType: MessageType.RECEIVED,
      image: null,
      username: "user"
    }
  ];
  constructor() { }

  ngOnInit(): void {

  }

  onClearChat() {
    this.chatList = []
  }

}
