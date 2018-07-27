import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CloginPage } from './clogin';

@NgModule({
  declarations: [
    CloginPage,
  ],
  imports: [
    IonicPageModule.forChild(CloginPage),
  ],
})
export class CloginPageModule {}
