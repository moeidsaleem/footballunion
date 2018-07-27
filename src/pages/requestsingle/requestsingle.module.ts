import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { RequestsinglePage } from './requestsingle';

@NgModule({
  declarations: [
    RequestsinglePage,
  ],
  imports: [
    IonicPageModule.forChild(RequestsinglePage),
  ],
})
export class RequestsinglePageModule {}
