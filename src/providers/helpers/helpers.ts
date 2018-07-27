import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LoadingController, AlertController, ModalController, ToastController, ActionSheetController } from 'ionic-angular';

/*
  Generated class for the HelpersProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class HelpersProvider {

  constructor(private alertCtrl:AlertController,private actionSheetCtrl:ActionSheetController,
    private toast:ToastController,private modalCtrl:ModalController) {
  }


  presentCustomActionSheet(title, buttons) {
    let actionSheet = this.actionSheetCtrl.create({
      title: title,
      buttons: buttons
      // [
      //   {
      //     text: 'Destructive',
      //     role: 'destructive',
      //     handler: () => {
      //       console.log('Destructive clicked');
      //     }
      //   },
      //   {
      //     text: 'Archive',
      //     handler: () => {
      //       console.log('Archive clicked');
      //     }
      //   },
      //   {
      //     text: 'Cancel',
      //     role: 'cancel',
      //     handler: () => {
      //       console.log('Cancel clicked');
      //     }
      //   }
      // ]
    });
    actionSheet.present();
  }
  presentActionSheet(title,successButton, cancelButton, success, cancel) {
    let actionSheet = this.actionSheetCtrl.create({
      title: title,
      buttons: [
        {
          text: successButton,
          handler:success
        },
        {
          text: cancelButton,
          role: 'cancel',
          handler:cancel
        }
      ]
    });
 
    actionSheet.present();
  }


  
  presentToast(msg) {
    let t = this.toast.create({
      message: msg,
      duration:  2300,
      position: 'bottom'
    });
  
    t.onDidDismiss(() => {
      console.log('Dismissed toast');
    });
  
    t.present();
  }


  presentCustomToast(msg, dur,pos) {
    let t = this.toast.create({
      message: msg,
      duration:  dur,
      position: pos
    });
  
    t.onDidDismiss(() => {
      console.log('Dismissed toast');
    });
  
    t.present();
  }


  showAlert(){
   
  }


  
  
  
  presentTopToast(msg) {
    let t = this.toast.create({
      message: msg,
      duration:  1800,
      position: 'top'
    });
  
    t.onDidDismiss(() => {
      console.log('Dismissed toast');
    });
  
    t.present();
  }
  presentConfirm(title,message,successButton, cancelButton, onsuccess,oncancel) {
    let alert = this.alertCtrl.create({
      title: title,
      message: message,
      buttons: [
        {
          text: cancelButton,
          role: 'cancel',
          handler: oncancel
        },
        {
          text: successButton,
          handler:onsuccess
        }
      ]
    });
    alert.present();
  }
  
}
