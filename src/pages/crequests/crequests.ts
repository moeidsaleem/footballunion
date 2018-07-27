import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ApiProvider } from '../../providers/api/api';
import { SpinnerProvider } from '../../providers/spinner/spinner';
import { HelpersProvider } from '../../providers/helpers/helpers';
import { CallNumber } from '@ionic-native/call-number';

/**
 * Generated class for the CrequestsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-crequests',
  templateUrl: 'crequests.html',
})
export class CrequestsPage {

  constructor(public navCtrl: NavController,private caller:CallNumber,
     public navParams: NavParams,private helper:HelpersProvider,
    private api:ApiProvider,private spinner:SpinnerProvider,
  ) {
  }


  pending;
  rejected;
  datax:any;
  accepted;
  ionViewDidLoad() {
    console.log('ionViewDidLoad CrequestsPage');
    let clubId =JSON.parse(localStorage.getItem('data')).uid;

    this.api.getClubRequests(clubId)
    .map(actions => {
      return actions.map(a => {
        const data = a.payload.doc.data()
        this.datax = data;
        const id = a.payload.doc.id;
        const status = this.datax.status;
        return { id,status, ...data };
      });
    })
    .subscribe(value=>{
      //now handling the requets 
      this.pending = value.filter((item)=>{
        return item.status == 'pending';
      })
      this.accepted = value.filter((item)=>{
        return item.status == 'accepted';
      })
      this.rejected = value.filter((item)=>{
        return item.status == 'accepted';
      });

    })
  }

  removeRequest(key){
    this.helper.presentConfirm('Remove Request', 'Are you sure you want to remove request?', 'Remove', 'Cancel',()=>{
      //success 
      this.spinner.load();

      this.api.deleteRequest(key).then(re=>{
        this.spinner.dismiss();
        this.helper.presentToast(`Request deleted`)
        
      })
    }, ()=>{
      //cancel

    })

  }


  callPhone(phone){
    this.caller.callNumber(phone, true).then(resp=>{
      //called
    }, ()=>{
      //err 
      this.helper.presentToast(`error calling user.`)
    }).catch((e)=> this.helper.presentToast(e))
  }

}
