import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { ApiProvider } from '../../providers/api/api';
import { SpinnerProvider } from '../../providers/spinner/spinner';

/**
 * Generated class for the FmyvideosPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-fmyvideos',
  templateUrl: 'fmyvideos.html',
})
export class FmyvideosPage {

  constructor(private camera: Camera,public navCtrl: NavController, private api:ApiProvider,private spinner:SpinnerProvider,
    public navParams: NavParams) {
  }
  footballerId;
  videos;
  ionViewDidLoad() {
    console.log('ionViewDidLoad FmyvideosPage');
    let acc =JSON.parse(localStorage.getItem('data')).accountType;
    console.log((JSON.parse(localStorage.getItem('data'))));
     if(acc == 'footballer'){
      this.footballerId =JSON.parse(localStorage.getItem('data')).uid;
     }else if(acc == 'footballer'){
      this.footballerId=this.navParams.get('id');
     }else{
      this.footballerId=this.navParams.get('id');
     }
       
    this.api.getFootballerVideos(this.footballerId).subscribe(c=>{
      this.videos =c;
      console.log(this.videos);
    })
  }


  selectedVideo:any;



  selectVideo(){
    const options: CameraOptions = {
      quality: 100,
      destinationType: this.camera.DestinationType.FILE_URI,
      sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
      // encodingType: this.camera.EncodingType,
      mediaType: this.camera.MediaType.VIDEO
    }
    
this.camera.getPicture(options).then((videoData) => {
  // imageData is either a base64 encoded string or a file URI
  // If it's base64 (DATA_URL):
  this.selectedVideo = videoData;
 // let base64Image = 'data:video/mp4;base64,' + videoData;
 }, (err) => {
  // Handle error
 });
    
  }

}
