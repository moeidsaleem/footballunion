import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { SpinnerProvider } from '../../providers/spinner/spinner';
import { ApiProvider } from '../../providers/api/api';
import { HelpersProvider } from '../../providers/helpers/helpers';

/**
 * Generated class for the CsetmatchPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-csetmatch',
  templateUrl: 'csetmatch.html',
})
export class CsetmatchPage {

  constructor(public navCtrl: NavController, public navParams: NavParams,private spinner:SpinnerProvider,
    private api:ApiProvider,private helper:HelpersProvider) {
  }

  match={
    date:'',
    time:'',
    team:'',
    clubId:''
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CsetmatchPage');
  }

 setMatch(){
   this.spinner.load();
  this.match.clubId =JSON.parse(localStorage.getItem('data')).uid;

   this.api.setMatch(this.match).then(resp=>{
     this.helper.presentToast(`Match has been set`);
     //set club recent match
     this.api.updateClubMatch(this.match.clubId, this.match).then(resp=>{
         this.spinner.dismiss();
         this.helper.presentTopToast(`Club recent match updated.`)
     });
   });
 }

}
