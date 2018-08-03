import { Component,ViewChild , ElementRef } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ApiProvider } from '../../providers/api/api';
import { SpinnerProvider } from '../../providers/spinner/spinner';
import { HelpersProvider } from '../../providers/helpers/helpers';

/**
 * Generated class for the CrequestPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-crequest',
  templateUrl: 'crequest.html',
})
export class CrequestPage {

  @ViewChild('myInput') myInput: ElementRef;

  request={
    type:'',
    description:'',
    clubName:'',
    phone:'',
    email:'',
    clubId:'',
    status:''
  }
  
  resize() {
      this.myInput.nativeElement.style.height = this.myInput.nativeElement.scrollHeight + 'px';
  }

  constructor(public navCtrl: NavController, private api:ApiProvider,private spinner:SpinnerProvider,private helper:HelpersProvider,
    public navParams: NavParams) {
  }

  club;
  ionViewDidLoad() {
    console.log('ionViewDidLoad CrequestPage');
    let clubId =JSON.parse(localStorage.getItem('data')).uid;
    this.api.getClub(clubId).subscribe(d=>{
      this.club = d;
    })
  }


  makeRequest(){
    this.spinner.load();
    this.request.clubName = this.club.name;
    this.request.phone = this.club.phone;
    this.request.email = this.club.email;
    this.request.status = 'pending';

    this.api.generateJoinRequest(this.request).then(resp=>{
      this.spinner.dismiss();
      this.helper.presentToast(`Request Generated`);
      this.request={
        type:'',
        status:'',
        description:'',
        clubName:'',
        phone:'',
        email:'',
        clubId:''
      }
    }).catch(err=>{
      this.helper.presentToast(err.message);
    });

  }




}
