import { Component,ViewChild } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Nav } from 'ionic-angular';
import { NavController } from 'ionic-angular';
import { ApiProvider } from '../providers/api/api';
import { AuthProvider } from '../providers/auth/auth';
import { AndroidPermissions } from '@ionic-native/android-permissions';
import { SpinnerProvider } from '../providers/spinner/spinner';
import firebase from 'firebase';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage:any = 'HomePage';

@ViewChild(Nav) nav:Nav;

getLocalTokens:any;

  constructor(private androidPermissions: AndroidPermissions,platform: Platform, statusBar: StatusBar, 
    splashScreen: SplashScreen, private auth:AuthProvider, private spinner:SpinnerProvider) {
    platform.ready().then(() => {
      statusBar.styleDefault();
      splashScreen.hide();
      if(localStorage.getItem('data')){
        let b=JSON.parse(localStorage.getItem('data')).uid;
        console.log(b);

        
      }
      

       // Here you can do any higher level native things you might need.
       this.androidPermissions.checkPermission(this.androidPermissions.PERMISSION.CAMERA).then(
        success => console.log('Permission granted'),
        err => this.androidPermissions.requestPermissions([this.androidPermissions.PERMISSION.CAMERA,this.androidPermissions.PERMISSION.READ_EXTERNAL_STORAGE])
      ).catch(err=>{
        console.log('CORDOVA PLUGIN CALLED! ANDROID PERMISSION GRANT')
      })
    });
  }
 


  logout(){
    this.spinner.load();
    this.auth.clearLocalTokens();

    this.nav.setRoot('HomePage');
    setTimeout(()=>{
      this.spinner.dismiss();

    },3000);
  }
  

  homePagee() {
    this.nav.setRoot('HomePage');
  }

  
  flogin() {
    this.nav.setRoot('FloginPage');
  }

  clogin() {
    this.nav.setRoot('CloginPage');
  }

 
  about() {
    this.nav.setRoot('AboutusPage');
  }

  whyPaid() {
    this.nav.setRoot('WhypaidPage');
  }

  playerProfile(){
    this.nav.setRoot('FprofilepublicPage');
  }

  playerSetting(){
    this.nav.setRoot('FprofilePage');
  }

  uploadVideo() {
    this.nav.setRoot('FuploadvideoPage');
  }

  myVideos() {
    this.nav.setRoot('FmyvideosPage');
  }
  myRequests(){
    this.nav.setRoot('CrequestsPage');
  }

  clubRequests() {
    this.nav.setRoot('FcrequestsPage');
  }

  clubProfile(){
    this.nav.setRoot('CprofilepublicPage');
  }

  clubSetting(){
    this.nav.setRoot('CprofilePage');
  }

  searchPlayer(){
    this.nav.setRoot('CsearchPage');
  }

  postRequest(){
    this.nav.setRoot('CrequestPage');
  }

  scheduleMatch(){
    this.nav.setRoot('CsetmatchPage');
  }

  Subscription(){
    this.nav.setRoot('MainPage');
  }
 

  

  
  
}

