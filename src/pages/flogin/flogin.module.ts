import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { FloginPage } from './flogin';
import { TextMaskModule } from 'angular2-text-mask';
import { ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    FloginPage,
  ],
  imports: [
    IonicPageModule.forChild(FloginPage),
    TextMaskModule,
    ReactiveFormsModule
  ],
})
export class FloginPageModule {}
