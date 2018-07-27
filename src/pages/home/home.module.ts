import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { HomePage } from './home';
import { FilterPipeModule } from 'ngx-filter-pipe';

@NgModule({
  declarations: [
    HomePage,
  ],
  imports: [
    IonicPageModule.forChild(HomePage),
    FilterPipeModule
  ],
})
export class HomePageModule {}
