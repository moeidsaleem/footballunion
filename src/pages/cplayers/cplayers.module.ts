import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CplayersPage } from './cplayers';

@NgModule({
  declarations: [
    CplayersPage,
  ],
  imports: [
    IonicPageModule.forChild(CplayersPage),
  ],
})
export class CplayersPageModule {}
