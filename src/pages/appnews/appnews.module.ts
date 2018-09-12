import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AppnewsPage } from './appnews';

@NgModule({
  declarations: [
    AppnewsPage,
  ],
  imports: [
    IonicPageModule.forChild(AppnewsPage),
  ],
})
export class AppnewsPageModule {}
