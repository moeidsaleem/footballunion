import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ApiProvider } from '../../providers/api/api';
import { HelpersProvider } from '../../providers/helpers/helpers';
import { SpinnerProvider } from '../../providers/spinner/spinner';
import { CallNumber } from '@ionic-native/call-number';

/**
 * Generated class for the FcrequestsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-fcrequests',
  templateUrl: 'fcrequests.html',
})
export class FcrequestsPage {

  constructor(public navCtrl: NavController,private caller:CallNumber,
     public navParams: NavParams,private helper:HelpersProvider,private spinner:SpinnerProvider,
    private api:ApiProvider) {
  }

  requests;
  req:any;
  ionViewDidLoad() {
    console.log('ionViewDidLoad FcrequestsPage');
    let footballerId =JSON.parse(localStorage.getItem('data')).uid;

    this.api.getFootballer(footballerId).subscribe(f=>{
      this.req =f;
      this.api.getTypeRequests(this.req.type)
      .map(actions => {
        return actions.map(a => {
          const data = a.payload.doc.data()
          const id = a.payload.doc.id;
          return { id, ...data };
        });
      }).subscribe(data=>{
        console.log(data);
          this.requests = data;
      })

      
    });
  }

  user:any;
  view(request){
    this.helper.presentConfirm(request.clubName, request.description + `<br> <br><hr><small> Call: ${request.phone || 'not-mentioned'}</small>`, 'Call','Cancel',()=>{
        //success
        this.callPhone(request.phone);
        // this.spinner.load();
        // let footballerId =JSON.parse(localStorage.getItem('data')).uid;
        // request.status = 'accepted';
        // request.footballerId = footballerId;
        // this.api.getFootballer(request.footballerId).subscribe(respx=>{
        //   this.user =respx;
        //    request.footballerName = this.user.name;
        //    request.footballerAge= this.user.age;
        //    return this.api.updateRequest(request.id, request).then(c=>{
        //     this.api.updateFootballer(request.footballerId, {clubId: request.clubId, clubName: request.clubName}).then(data=>{
        //       this.spinner.dismiss();
        //       this.helper.presentToast(`Request Accepted! Joined  ${request.clubName}`);
        //     })
        //  })
          
        // })

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
