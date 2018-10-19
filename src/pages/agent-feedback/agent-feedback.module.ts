import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AgentFeedbackPage } from './agent-feedback';

@NgModule({
  declarations: [
    AgentFeedbackPage,
  ],
  imports: [
    IonicPageModule.forChild(AgentFeedbackPage),
  ],
})
export class AgentFeedbackPageModule {}
