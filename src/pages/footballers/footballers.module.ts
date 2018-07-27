import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { FootballersPage } from './footballers';
import { FilterPipeModule } from 'ngx-filter-pipe';

@NgModule({
  declarations: [
    FootballersPage,
  ],
  imports: [
    IonicPageModule.forChild(FootballersPage),
    FilterPipeModule

  ],
})
export class FootballersPageModule {}
