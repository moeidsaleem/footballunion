import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ApiProvider } from '../../providers/api/api';

/**
 * Generated class for the CprofilepublicPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-cprofilepublic',
  templateUrl: 'cprofilepublic.html',
})
export class CprofilepublicPage {

  clubId;
  club;

  constructor(public navCtrl: NavController, public navParams: NavParams,private api:ApiProvider) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CprofilepublicPage');
    let acc =JSON.parse(localStorage.getItem('data')).accountType;
     if(acc == 'club'){
      this.clubId =JSON.parse(localStorage.getItem('data')).uid;
     }else if(acc == 'footballer'){
      this.clubId=this.navParams.get('id');
     }else{
      this.clubId=this.navParams.get('id');
     }
       
    this.api.getClub(this.clubId).subscribe(c=>{
      this.club =c;
      console.log(this.club);
    })
    
  

  }


  players(){
    this.navCtrl.push('CplayersPage', this.club.clubId);
  }

}
