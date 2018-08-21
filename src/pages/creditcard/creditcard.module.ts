import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CreditcardPage } from './creditcard';
import { TextMaskModule } from 'angular2-text-mask';

@NgModule({
  declarations: [
    CreditcardPage,
  ],
  imports: [
    IonicPageModule.forChild(CreditcardPage),
    TextMaskModule
    
  ],
})
export class CreditcardPageModule {}
