import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { HelpersProvider } from '../../providers/helpers/helpers';
import { ApiProvider } from '../../providers/api/api';
import { Stripe } from '@ionic-native/stripe';
import { SpinnerProvider } from '../../providers/spinner/spinner';
/**
 * Generated class for the CreditcardPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-creditcard',
  templateUrl: 'creditcard.html',
})
export class CreditcardPage {
  constructor(public navCtrl: NavController,private spinner:SpinnerProvider
    , public viewCtrl: ViewController,public navParams: NavParams,private helper:HelpersProvider,
  private api:ApiProvider, private stripe:Stripe) {
    this.masks = {
      phoneNumber: ['(', /[1-9]/, /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/],
      cardNumber: [/\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/],
      cardExpiry: [/[0-1]/, /\d/, '/', /[1-2]/, /\d/],
      cvv: [/[a-zA-z]/, ':', /\d/, /\d/, /\d/, /\d/]
  };
  }


  final;
  ionViewDidLoad() {
    this.final= this.navParams.get('data').final;
    console.log(this.final);
    console.log('ionViewDidLoad CreditcardPage');
  }
  masks: any; 
  phoneNumber: any = "";
  cardNumber: any = "";
  cardMonth: any = "";
  cardYear: any = "";
  cvv: any = "";

  resetValues(){     
  this.phoneNumber = "";
  this.cardNumber = "";
  this.cardMonth = "";
  this.cardYear = "";
  this.cvv = "";
  }

pay(){
  let card = {
  //  phoneNumber: this.phoneNumber.replace(/\D+/g, ''),
    number: String(this.cardNumber.replace(/\D+/g, '')),
    expMonth: Number(this.cardMonth.replace(/\D+/g, '')),
    expYear: Number( this.cardYear.replace(/\D+/g, '')),
    cvc: String(this.cvv.replace(/[^a-zA-Z0-9 -]/g, ''))
};
if(card.expYear !==0 &&card.expYear <2018 || card.expYear > 2050){
  this.helper.presentTopToast(`Year must be in correct format (2018 - 2050).`);
  this.cardYear = '';
}
if(card.expMonth <1 || card.expMonth >12){
  this.helper.presentTopToast(`Month must be in correct format (01 -12).`);
  this.cardMonth ='';
}

console.log(card);
if(card.number==(''||undefined) && card.expMonth ==(0||null) && card.expYear == (0||null) && card.cvc==(''|| undefined)){ 
  this.helper.presentToast(`Please provide all data.`);
}
if(card.number && card.expMonth>=1 && card.expMonth<=12  && card.expYear>=2018 && card.expYear<=2050 && card.cvc ){
  this.spinner.load();
  console.log('data');
  this.stripe.setPublishableKey('pk_live_1VIsc0uf56NbspUD9xo1xhxD');
  this.stripe.createCardToken(card).then(token=>{
      this.api.sendPaymentToken(token, this.final).subscribe(response=>{
        /* on payment completion */
        console.log(response);
        if(response.success == true){
          this.api.paid().then(resp=>{
            this.spinner.dismiss();
            this.helper.presentToast(`Payment successful!`);
            console.log(resp);
            this.navCtrl.push('SummaryPage', resp.id).then(R=>{
              this.api.resetOrder();
              this.api.resetCart();

            })
          },error=>{ 
            /* on failure */
            this.helper.presentToast(error.message);   
                     this.spinner.dismiss();
          });
        }else if(response.success == false){
          this.helper.presentToast(response.data);
          this.dismiss();
           this.spinner.dismiss();
          this.resetValues();
        }
      },err=>{
        this.spinner.dismiss();
        this.helper.presentToast(`Server Error! Cannot process card.`)
      })
  },(creditErr)=>{ 
   // this.dismiss();
    this.spinner.dismiss();
    this.helper.presentCustomToast(`Credit Card Error! Please enter valid card details.`,3000, 'top');
   // this.resetValues();
  }).catch(erx=> {
    this.spinner.dismiss();
    this.helper.presentTopToast(erx);
  });
}
 }

 dismiss() {
   this.viewCtrl.dismiss();
}


}