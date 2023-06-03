import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ChatModuleRoutingModule } from './chat-module-routing.module';
import { ChatModuleComponent } from './chat-module.component';

//import { ScrollingModule } from '@angular/cdk/scrolling';
import { ChatFormComponent } from './chat-container/chat-form/chat-form.component';


import {MatButtonModule} from '@angular/material/button';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatIconModule} from '@angular/material/icon';


import {FormsModule} from '@angular/forms';
import { ChatContainerComponent } from './chat-container/chat-container.component';
import { ChatContentContainerComponent } from './chat-container/chat-content-container/chat-content-container.component';
import { AudioRecordingPanelComponent } from './chat-container/audio-recording-panel/audio-recording-panel.component';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { AppRecordingOscillatorComponent } from './app-recording-oscillator/app-recording-oscillator.component';

@NgModule({
  declarations: [
    ChatModuleComponent,
    ChatFormComponent,
    ChatContainerComponent,
    ChatContentContainerComponent,
    AudioRecordingPanelComponent,
    AppRecordingOscillatorComponent,
    AppRecordingOscillatorComponent
  ],
  imports: [
    CommonModule,
    ChatModuleRoutingModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    FormsModule,
    MatIconModule,
    MatProgressBarModule
  //  ScrollingModule
  ]
})
export class ChatModuleModule { }
