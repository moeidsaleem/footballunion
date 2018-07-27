import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { HelpersProvider } from '../../providers/helpers/helpers';
import { ApiProvider } from '../../providers/api/api';
import { SpinnerProvider } from '../../providers/spinner/spinner';

/**
 * Generated class for the CsearchPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-csearch',
  templateUrl: 'csearch.html',
})
export class CsearchPage {

  constructor(public navCtrl: NavController, public navParams: NavParams,private helper:HelpersProvider,private spinner:SpinnerProvider, private api:ApiProvider) {
  }

  search={
    name:'',
    age:null,
    skill:'',
    area:''
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CsearchPage');
  }

  searchFootballer(){
    let s={
      name:String(this.search.name),
      age:Number(this.search.age),
      skill: String(this.search.skill),
      area: String(this.search.area)
    }
    console.log(s);
    this.navCtrl.push('FootballersPage',s);

   
  }

}
