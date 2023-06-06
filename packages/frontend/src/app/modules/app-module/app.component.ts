import { Component } from '@angular/core';
import { LocalStorageService } from '@app/services';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'ai-chat-frontend';

  constructor(private localStorageService: LocalStorageService) {
    this.localStorageService.setSessionId()
  }
}
