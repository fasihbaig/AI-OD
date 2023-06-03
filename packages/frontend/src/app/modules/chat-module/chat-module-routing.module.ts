import { NgModule } from '@angular/core';
import { Router, RouterModule, Routes } from '@angular/router';
import { ChatModuleComponent } from './chat-module.component';
import { ChatContainerComponent } from './chat-container/chat-container.component';


const routes: Routes = [
  { path: '', redirectTo: "/chat", pathMatch: "full" },
  { 
    path: 'chat',
    component: ChatModuleComponent,
    children: [
      {
        path: "",
        component: ChatContainerComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ChatModuleRoutingModule { }

/*

const routes: Routes = [
    {
        path: 'student',
        component: StudentComponent,
        children: [
            {
                path: 'list',
                component: StudentListComponent
            },
            {
                path: 'detail',
                component: StudentDetailComponent
            }
        ]
    }
];
*/