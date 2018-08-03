import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { SpinnerProvider } from '../../providers/spinner/spinner';
import { ApiProvider } from '../../providers/api/api';
import { HelpersProvider } from '../../providers/helpers/helpers';
import { StreamingMedia, StreamingVideoOptions } from '@ionic-native/streaming-media';



@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
})
export class HomePage {
  constructor(public navCtrl: NavController, public navParams: NavParams,private spinner:SpinnerProvider, private streamingMedia:StreamingMedia,
    private api:ApiProvider, private helper:HelpersProvider) {

    
  }


 
  playVideo(url){
    console.log(`video played`)
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

  clicked(e){
    console.log(e);
    console.log( `clickedd`)
  }

  userFilter = {
    title:''
  }

  //first will load trending videos 

  videos;
  ionViewDidLoad() {
    console.log('ionViewDidLoad HomePage');
      this.api.getTrendingVideos()
      .map(actions => {
        return actions.map(a => {
          const data = a.payload.doc.data()
          const id = a.payload.doc.id;
          return { id, ...data };
        });
      }).subscribe(vids=>{
        this.videos= vids;
        console.log(this.videos);
      });
  }

  productPage() {
    this.navCtrl.push('ProductdetailsPage');
  }


  getVideos(type){
    this.navCtrl.push('VresultPage', type)
  }

  

}
