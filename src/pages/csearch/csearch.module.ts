import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CsearchPage } from './csearch';

@NgModule({
  declarations: [
    CsearchPage,
  ],
  imports: [
    IonicPageModule.forChild(CsearchPage),
  ],
})
export class CsearchPageModule {}
