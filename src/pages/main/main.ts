import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ApiProvider } from '../../providers/api/api';
import { AuthProvider } from '../../providers/auth/auth';
import { SpinnerProvider } from '../../providers/spinner/spinner';
import { HelpersProvider } from '../../providers/helpers/helpers';
import { PayPal, PayPalPayment, PayPalConfiguration } from '@ionic-native/paypal';

/**
 * Generated class for the MainPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-main',
  templateUrl: 'main.html',
})
export class MainPage {

  constructor(public navCtrl: NavController,private payPal: PayPal,
     private api:ApiProvider,private auth:AuthProvider,
    private spinner:SpinnerProvider, private helper:HelpersProvider,
    public navParams: NavParams) {
  }

  club:any;
  packages:any;
  ionViewDidLoad() {
    console.log('ionViewDidLoad MainPage');
  this.club =  JSON.parse(localStorage.getItem('data'))
  this.getPackages();
  }
  ionViewCanLeave(){
    let status = this.club.premium;
    if(status && status == true){
      return true;
    }else{
      return false;
    }
  }
  ionViewDidLeave(){
    console.log(`lefttt`)
  }


  addDays(date, days) {
    var result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  }

  onSubscribe(sub){
    this.club.package = sub;
    this.club.premium = true;
    // set end date  
    let d = new Date();
    this.club.expiryDate = this.addDays(d, sub.days).toLocaleDateString();
    this.api.updateClub(this.club.uid, this.club  ).then(r=>{
      this.auth.saveClubLocalTokens(this.club);
    })

  }


datax;
  getPackages(){
    this.api.getPackages()
    .map(actions => {
      return actions.map(a => {
        this.datax = a.payload.doc.data();
        const id = a.payload.doc.id;
        const status = this.datax.status;
        return { id,status, ...this.datax };
      });
    })
    .subscribe(resp=>{
      this.packages =resp;
    })
  }
  onLogout(){
    this.helper.presentConfirm('Logout',' Are you sure you want to logout?', 'Logout', 'Cancel', ()=>{
      //on logout 
      this.spinner.load();
      this.club.premium = true;
      this.navCtrl.setRoot('CloginPage').then(()=>{
        this.auth.clearLocalTokens();
        this.spinner.dismiss();
      })
    }, ()=>{
      //on cancel

    })
   
  }










  pay(selectedPackage){
    this.payPal.init({
      PayPalEnvironmentProduction: 'YOUR_PRODUCTION_CLIENT_ID',
      PayPalEnvironmentSandbox: 'AQFKbpnWT04upY21yYs_Xn3YlQCNzYru_hdUUSK5e6jUXBrN20bPQUuZ6buiA1C-mRAwHPQdMkAr3CQn'
    }).then(() => {
      // Environments: PayPalEnvironmentNoNetwork, PayPalEnvironmentSandbox, PayPalEnvironmentProduction
      this.payPal.prepareToRender('PayPalEnvironmentSandbox', new PayPalConfiguration({
        // Only needed if you get an "Internal Service Error" after PayPal login!
        //payPalShippingAddressOption: 2 // PayPalShippingAddressOptionPayPal
      })).then(() => {
        let payment = new PayPalPayment(selectedPackage.amount, 'USD', `Subscribed Package: ${selectedPackage.name}`, 'subscription');
        this.payPal.renderSinglePaymentUI(payment).then(() => {
          // Successfully paid
          this.onSubscribe(selectedPackage);
    
        }, () => {
          // Error or render dialog closed without being successful
          this.helper.presentToast(`Cancel`)
        });
      }, () => {
        // Error in configuration
        this.helper.presentToast(`Error in making payment`)

      });
    }, () => {
      // Error in initialization, maybe PayPal isn't supported or something else
      this.helper.presentToast(`Error: Paypal not supported.`);

    });
  }


  

}
