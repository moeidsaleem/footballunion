import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ApiProvider } from '../../providers/api/api';
import { SpinnerProvider } from '../../providers/spinner/spinner';
import { HelpersProvider } from '../../providers/helpers/helpers';
import { AndroidPermissions } from '@ionic-native/android-permissions';
import { Camera, CameraOptions } from '@ionic-native/camera';

/**
 * Generated class for the FprofilePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-fprofile',
  templateUrl: 'fprofile.html',
})
export class FprofilePage {

  constructor(public navCtrl: NavController, private spinner:SpinnerProvider,
    private androidPermissions: AndroidPermissions,
     private helper:HelpersProvider,
     private camera:Camera,
    public navParams: NavParams,private api:ApiProvider) {
  }

  // user={
  //   username:'',
  //   password:'',
  //   position:'',
  //   club:'',
  //   age:'',
  //   phone:'',
  //   schedule:'',
  //   country:'',
  //   locality:'',
  //   photo:''
  // }
  user:any;
  id:String;
  ionViewDidLoad() {
    console.log('ionViewDidLoad FprofilePage');
    this.id =JSON.parse(localStorage.getItem('data')).uid;
    this.api.getFootballer(this.id).subscribe(user=>{
      this.user =user;
    })
  }
  updateProfile(){
    this.spinner.load();
  return  this.api.updateFootballer(this.id, this.user).then(resp=>{
      console.log(`profile updated`);
      this.spinner.dismiss();
      this.helper.presentToast(`Profile updated`)
    })
  }


  updateImage(){
    let options:CameraOptions ={
       quality:100,
       mediaType:this.camera.MediaType.PICTURE,
       sourceType:this.camera.PictureSourceType.PHOTOLIBRARY,
       destinationType:this.camera.DestinationType.DATA_URL      
    }
    this.camera.getPicture(options).then(imageData=>{
      this.user.photo = 'data:image/jpeg;base64,' + imageData;
      this.spinner.load();
      this.updateProfile();
    }, err=>{
      this.helper.presentToast(err);
    }).catch((e)=> this.helper.presentToast(e))
    
  }


}