import { Component, Sanitizer, ViewChild, ElementRef } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, Platform, ActionSheet, ActionSheetController, LoadingController } from 'ionic-angular';
import { ApiProvider } from '../../providers/api/api';
import { Camera, CameraOptions } from '@ionic-native/camera';
// import { VideoPlayer, VideoOptions } from '@ionic-native/video-player';
import { AngularFireStorage, AngularFireUploadTask } from 'angularfire2/storage';
import { SpinnerProvider } from '../../providers/spinner/spinner';
import { HelpersProvider } from '../../providers/helpers/helpers';
import { FileChooser } from '@ionic-native/file-chooser';
import { FilePath } from '@ionic-native/file-path';
import { AngularFirestore } from 'angularfire2/firestore';
import { File } from '@ionic-native/file';
import firebase from 'firebase';
import { AngularFireAuth } from 'angularfire2/auth';
import { AndroidPermissions } from '@ionic-native/android-permissions';
/**
 * Generated class for the FuploadvideoPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-fuploadvideo',
  templateUrl: 'fuploadvideo.html',
})
export class FuploadvideoPage {
  private loader: any;

  constructor(
    public navCtrl: NavController,
    private camera: Camera,
    private fileChooser: FileChooser,
    private androidPermissions: AndroidPermissions,
    private toast: ToastController,
    private loadCtrl: LoadingController,
    private platform: Platform,
    private file: File,
    public afAuth: AngularFireAuth,
    private filePath: FilePath,
    private api:ApiProvider,
    private helper:HelpersProvider
  ) {
    this.requestStoragePermission();
  }


  data={
    url:'',
    fullPath:'',
    thumbnail:'',
    title:'',
    trending:true,
    type:''
  }

  selectFile() {
    if (this.platform.is("android")) {
      this.checkPermission();
    } else {
      this.openGallery();
    }
  }

  checkPermission() {
    this.androidPermissions
      .checkPermission(this.androidPermissions.PERMISSION.READ_EXTERNAL_STORAGE)
      .then(
        success => {
          this.openGallery();
        },
        error => {
          this.requestStoragePermission();
        }
      );
  }

  requestStoragePermission() {
    this.androidPermissions
      .requestPermission(
        this.androidPermissions.PERMISSION.READ_EXTERNAL_STORAGE
      )
      .then(
        success => {
          // this.presentToast("click again to open gallery");
          // this.openGallery();
        },
        error => {
          this.helper.presentTopToast("Cannot access gallery.");
        }
      );
  }

  openGallery() {
    this.fileChooser
      .open()
      .then(uri => {
        this.presentLoading();

        console.log(uri);
        console.log("file uri");
        this.filePath
          .resolveNativePath(uri)
          .then(filep => {
            console.log("actual file path");
            console.log(filep);
            this.resolveFilePathforLocal(filep);
          })
          .catch(err => {
            this.helper.presentToast(err);
            console.log(err)});
      })
      .catch(e =>{this.helper.presentToast(e)});
  }


newUrl;
dirPath;
dirSegment;


startUpload(){
  if(this.newUrl && this.data.title && this.data.thumbnail && this.data.type){

  this.file.readAsArrayBuffer(this.dirPath, this.newUrl.name).then(async buffer => {
    await this.upload(buffer, this.newUrl.name);
  });

}else{
  this.helper.presentToast(` Please provide all data for upload.`)
}
}

  resolveFilePathforLocal(f) {
    this.file.resolveLocalFilesystemUrl(f).then(newUrl => {
      let dirPath = newUrl.nativeURL;
      let dirSegment = dirPath.split("/");
      dirSegment.pop();
      dirPath = dirSegment.join("/");
      
      //globally setting it up
      this.dirPath = dirPath;
      this.newUrl = newUrl;
      /* Now the file has been selected! */
      // this.file.readAsArrayBuffer(dirPath, newUrl.name).then(async buffer => {
      //   await this.upload(buffer, newUrl.name);
      // });
    });
  }

  async upload(buffer, name) {
    let blob = new Blob([buffer], { type: "video/*" });

    let fileStorage = firebase.storage();
    fileStorage
      .ref("videos/" + name)
      .put(blob)
      .then(
        success => {
          this.loader.data.content = "Finished uploading video";
          //now save this to database.
          this.api.storeInfoToDatabase(success.metadata, this.data).then(ondone=>{    
            this.data={
              url:'',
              fullPath:'',
              thumbnail:'',
              title:'',
              trending:true,
              type:''
            }
            this.presentToast("Finished uploading video");
                  this.loader.dismiss();
          })

          // this.createEvent(event, success.downloadURL);
        },
        error => {
          this.presentToast("Uploading failed");
        }
      );
  }

  presentToast(message: string) {
    let toast = this.toast.create({
      message: message,
      duration: 5000,
      position: "bottom"
    });
    toast.present();
  }

  async presentLoading() {
    this.loader = this.loadCtrl.create({
      spinner: "circles",
      content: "Uploading Files",
      dismissOnPageChange: true
    });
    this.loader.present();
  }


  uploadThumbnail(){
    let options:CameraOptions ={
       quality:100,
       mediaType:this.camera.MediaType.PICTURE,
       sourceType:this.camera.PictureSourceType.PHOTOLIBRARY,
       destinationType:this.camera.DestinationType.DATA_URL      
    }
    this.camera.getPicture(options).then(imageData=>{
      this.data.thumbnail = 'data:image/jpeg;base64,' + imageData;
    }, err=>{
      this.helper.presentToast(err);
    }).catch((e)=> this.helper.presentToast(e));
    
  }
}