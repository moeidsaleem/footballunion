import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ApiProvider } from '../../providers/api/api';
import { HelpersProvider } from '../../providers/helpers/helpers';
import { SpinnerProvider } from '../../providers/spinner/spinner';

/**
 * Generated class for the FprofilepublicPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-fprofilepublic',
  templateUrl: 'fprofilepublic.html',
})
export class FprofilepublicPage {

  constructor(public navCtrl: NavController, public navParams: NavParams,private api:ApiProvider,private spinner:SpinnerProvider,private helper:HelpersProvider,
  ) {
  }

  footballerId;
  footballer;
  ionViewDidLoad() {
    console.log('ionViewDidLoad FprofilepublicPage');
    let acc =JSON.parse(localStorage.getItem('data')).accountType;
     if(acc == 'footballer'){
      this.footballerId =JSON.parse(localStorage.getItem('data')).uid;
     }else if(acc == 'footballer'){
      this.footballerId=this.navParams.get('id');
     }else{
      this.footballerId=this.navParams.get('id');
     }
       
    this.api.getFootballer(this.footballerId).subscribe(c=>{
      this.footballer =c;
      console.log(this.footballer);
    })
    
  }


  

  videos(){
    this.navCtrl.push('FmyvideosPage', this.footballerId);
  }

}
