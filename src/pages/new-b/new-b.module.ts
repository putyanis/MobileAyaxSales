import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { NewBPage } from './new-b';

@NgModule({
  declarations: [
    NewBPage,
  ],
  imports: [
    IonicPageModule.forChild(NewBPage),
  ],
})
export class NewBPageModule {}
