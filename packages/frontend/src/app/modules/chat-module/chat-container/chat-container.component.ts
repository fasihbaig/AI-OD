import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-chat-container',
  templateUrl: './chat-container.component.html',
  styleUrls: ['./chat-container.component.scss']
})
export class ChatContainerComponent implements OnInit {
  public chatList: any[] = [ { type: "text", message: "123"} ];
  constructor() { }

  ngOnInit(): void {
  }

}
