import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ApiProvider } from '../../providers/api/api';
import { HelpersProvider } from '../../providers/helpers/helpers';
import { SpinnerProvider } from '../../providers/spinner/spinner';
import { StreamingMedia, StreamingVideoOptions } from '@ionic-native/streaming-media';

/**
 * Generated class for the VresultPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-vresult',
  templateUrl: 'vresult.html',
})
export class VresultPage {


  
  videos;
  type;
  constructor(public navCtrl: NavController,private streamingMedia: StreamingMedia,
     public navParams: NavParams,private api:ApiProvider, private helper:HelpersProvider, private spinner:SpinnerProvider) {
  }

  ionViewDidLoad() {
    this.type = this.navParams.data;
    console.log(this.type);
    if(this.type){
      this.api.getTypeVideos(this.type) .map(actions => {
        return actions.map(a => {
          const data = a.payload.doc.data()
          const id = a.payload.doc.id;
          return { id, ...data };
        });
  
      }).subscribe(resp=>{
        console.log(resp);
        this.videos =resp;
      })
    }

  }


  playVideo(url){
    let options: StreamingVideoOptions = {
      successCallback: () => { console.log('Video played') },
      errorCallback: (e) => {
         console.log('Error streaming');
         this.helper.presentTopToast(`Error Streaming`)
        
         },
      orientation: 'portrait'
    };
    
    this.streamingMedia.playVideo(url, options) 
  }


}
