import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ApiProvider } from '../../providers/api/api';
import { HelpersProvider } from '../../providers/helpers/helpers';
import { SpinnerProvider } from '../../providers/spinner/spinner';
import 'rxjs/add/operator/map';
import {Observable} from "rxjs";


/**
 * Generated class for the FootballersPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */


@IonicPage()
@Component({
  selector: 'page-cplayers',
  templateUrl: 'cplayers.html',
})
export class CplayersPage {

  constructor(public navCtrl: NavController, public navParams: NavParams,private api:ApiProvider,private helper:HelpersProvider,private spinner:SpinnerProvider) {
  }
  footballers:any;
  search;
  clubId
  

  ionViewDidLoad() {
    this.spinner.load();
    this.clubId =JSON.parse(localStorage.getItem('data')).uid;
    console.log('ionViewDidLoad FootballersPage');
   this.search =this.navParams.data;
   console.log(this.search);
     console.log(`no search values found.`)
    this.api.getClubFootballers(this.clubId).subscribe(resp=>{
      this.spinner.dismiss();
      this.footballers = resp;
      console.log(this.footballers);
     })  

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
      });
    }
  }
}
