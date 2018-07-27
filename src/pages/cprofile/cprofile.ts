import { Component,ViewChild , ElementRef } from '@angular/core';
import { IonicPage, NavController, NavParams, Spinner } from 'ionic-angular';
import { ApiProvider } from '../../providers/api/api';
import { SpinnerProvider } from '../../providers/spinner/spinner';
import { HelpersProvider } from '../../providers/helpers/helpers';
import { Camera, CameraOptions } from '@ionic-native/camera';

/**
 * Generated class for the CprofilePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-cprofile',
  templateUrl: 'cprofile.html',
})
export class CprofilePage {

  @ViewChild('myInput') myInput: ElementRef;
  
  resize() {
      this.myInput.nativeElement.style.height = this.myInput.nativeElement.scrollHeight + 'px';
  }

 
  constructor(public navCtrl: NavController,private helper:HelpersProvider,private camera:Camera,
     public navParams: NavParams,private spinner:SpinnerProvider,private api:ApiProvider) {
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
    console.log('ionViewDidLoad CProfilePAge');
    this.id =JSON.parse(localStorage.getItem('data')).uid;
    this.api.getClub(this.id).subscribe(user=>{
      this.user =user;
    })
  }
  updateProfile(){
    this.spinner.load();
    this.api.updateClub(this.id, this.user).then(resp=>{
      console.log(`profile updated`);
      this.spinner.dismiss();
      this.helper.presentToast(`Profile Updated.`)
    })
  }


  
  selectSource(){
    this.helper.presentCustomActionSheet('Photo Source', [
      {
        text:'Camera',
        handler:()=>{
          this.updatePhoto(this.camera.PictureSourceType.CAMERA)
        }
      },
      {
        text:'Library',
        handler:()=>{
          this.updatePhoto(this.camera.PictureSourceType.PHOTOLIBRARY)
        }
      },
      {
        text:'Cancel',
        role:'cancel',
        handler:()=>{ console.log('cancel')}
      }
    ],)
  }

  //update Photo
  updatePhoto(source){
 
    let options:CameraOptions ={
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      destinationType:this.camera.DestinationType.DATA_URL,
      quality:100,
      sourceType:source
    }
    this.camera.getPicture(options).then(imageData=>{
      this.spinner.load();
      this.user.photo= 'data:image/jpeg;base64,' + imageData;
      this.api.updateClub(this.id, this.user).then(resp=>{
        console.log(`profile updated`);
        this.spinner.dismiss();
        this.helper.presentToast(`Profile Updated.`)
      })    },err=>{
      this.helper.presentTopToast(err);
    })
  }

  



}
