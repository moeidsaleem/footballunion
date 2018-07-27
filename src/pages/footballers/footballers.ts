import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ApiProvider } from '../../providers/api/api';
import { HelpersProvider } from '../../providers/helpers/helpers';
import { SpinnerProvider } from '../../providers/spinner/spinner';
import 'rxjs/add/operator/map';
import {Observable} from "rxjs";
import { CallNumber } from '@ionic-native/call-number';


/**
 * Generated class for the FootballersPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-footballers',
  templateUrl: 'footballers.html',
})
export class FootballersPage {

  constructor(public navCtrl: NavController,private caller:CallNumber,
     public navParams: NavParams,private api:ApiProvider,private helper:HelpersProvider,private spinner:SpinnerProvider) {
  }
  footballers:any;
  search;

  ionViewDidLoad() {
    this.spinner.load();
    console.log('ionViewDidLoad FootballersPage');
   this.search =this.navParams.data;
   console.log(this.search);
   if(this.search == undefined || this.search == null){
     console.log(`no search values found.`)
    this.api.getFootballers().subscribe(resp=>{
      this.spinner.dismiss();
      this.footballers = resp;
      console.log(this.footballers);
     })

   }else if(this.search){
     console.log(`search vlaues found`)
     this.spinner.dismiss();
   this.api.getFilterFootballers(this.search.name, Number(this.search.age), this.search.skill,this.search.area)
   .map(actions => {
      return actions.map(a => {
        const data = a.payload.doc.data()
        const id = a.payload.doc.id;
        return { id, ...data };
      });

    })
    .subscribe(users=>{
      this.spinner.dismiss();
     this.footballers =users;
     this.temp = users;
     console.log(this.footballers);
     this.spinner.dismiss();
   })
  }



  

  }

  
  
  selectPlayer(id){
   this.navCtrl.push('FprofilepublicPage', id); 
  }


  temp;
 // userFilter = {name:'Doctor'};
  terms:any ='';
  searchTerm: string = '';


  getItems(ev) {
    // Reset items back to all of the items
    this.footballers =this.temp;

    // set val to the value of the ev target
    var val = ev.target.value;

    // if the value is an empty string don't filter the items
    if (val && val.trim() != '') {
      this.footballers = this.footballers.filter((item) => {
        return (item.name.toLowerCase().indexOf(val.toLowerCase()) > -1);
      })
    }
  }


  details(id){
    this.navCtrl.push('FprofilepublicPage', {id:id});

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
