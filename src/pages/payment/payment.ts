import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController } from 'ionic-angular';
import { PayPal, PayPalPayment, PayPalConfiguration, PayPalPaymentDetails } from '@ionic-native/paypal';
import { ApiProvider } from '../../providers/api/api';
import { SpinnerProvider } from '../../providers/spinner/spinner';
import { HelpersProvider } from '../../providers/helpers/helpers';
import { isNumber } from 'ionic-angular/util/util';
import { Stripe } from '@ionic-native/stripe';
//import { Braintree, PaymentUIOptions, PaymentUIResult } from '@ionic-native/braintree';

/**
 * Generated class for the PaymentPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-payment',
  templateUrl: 'payment.html',
})
export class PaymentPage {

  method;
  final:any;
  

  constructor(public navCtrl: NavController,public modalCtrl: ModalController,private stripe: Stripe, public navParams: NavParams, private spinner:SpinnerProvider,private helper:HelpersProvider,private api:ApiProvider,
    private payPal: PayPal,
  //  private braintree: Braintree
  ) {

    // this.pay();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PaymentPage');
    this.calculate();
    
 
  }

  ionViewDidLeave(){
    this.final =0;
    this.api.resetTaxTotal();
  }

  calculateTotal(){
    console.log(this.api.order);
    let cart = this.api.order.cart;
    let total =0;
      for(let i=0;i<=cart.length;i++){
          console.log(cart[i].price);
          console.log(cart[i].quantity);
          total = total + ( cart[i].price * cart[i].quantity );
          console.log(total);
        
      
      }
      setTimeout(()=>{
        
      })
      return total;   
  }

  nextPage() {
    this.navCtrl.push('SummaryPage');
  }

  pay(){
    this.payPal.init({
      PayPalEnvironmentProduction: 'ENYdFdb8AO3P1jdHWUkMivpG27Q400_Tz0kVG-cscWovBrGKvMERvH-teBISKdqxieALQ71moTsxyTTd',
      PayPalEnvironmentSandbox: ''
      //PayPalEnvironmentSandbox: 'AWm8HyAxIf0RoPg2ZhmuT4xrVAiYjGqzgM8grgWwu6xDXAkpx3S3Zn3LdGLhhuJ96XlQwtsJi8h1Oeyd'
    }).then(() => {
      // Environments: PayPalEnvironmentNoNetwork, PayPalEnvironmentSandbox, PayPalEnvironmentProduction
      this.payPal.prepareToRender('PayPalEnvironmentProduction', new PayPalConfiguration({
        // Only needed if you get an "Internal Service Error" after PayPal login!
        //payPalShippingAddressOption: 2 // PayPalShippingAddressOptionPayPal
      })).then(() => {
        let payment = new PayPalPayment(this.calculateTotal().toString(), 'USD', 'Description', 'sale');
        this.payPal.renderSinglePaymentUI(payment).then(() => {

          console.log('successfull');
          // Successfully paid
          this.api.paid();
          

    
        }, () => {
          // Error or render dialog closed without being successful
          this.helper.presentToast('Payment not successful!');
        });
      }, () => {
        // Error in configuration
      });
    }, () => {
      // Error in initialization, maybe PayPal isn't supported or something else
    });
  }


 sum(price, quanity) {
    return price * quanity;
}



total=0;


makePayment(){
  if(this.method=='paypal'){
    this.payPal.init({
        PayPalEnvironmentProduction: 'Ad7xSFH30qvmAzzrSC5ufmkzvVv3a0U0BEhGKcAaBuyopUVsXSD9YIdeFotWMl5QlN5vR8kZv4BkdyqL',
      PayPalEnvironmentSandbox: 'AWm8HyAxIf0RoPg2ZhmuT4xrVAiYjGqzgM8grgWwu6xDXAkpx3S3Zn3LdGLhhuJ96XlQwtsJi8h1Oeyd'
    }).then(() => {
      this.payPal.prepareToRender('PayPalEnvironmentProduction', new PayPalConfiguration({
        // acceptCreditCards: true,
        // languageOrLocale: 'pt-BR',
        // merchantName: 'CanalDoAbranches',
        // merchantPrivacyPolicyURL: '',
        // merchantUserAgreementURL: ''
      })).then(() => {
        let final =this.api.order.total + this.api.order.tax;
        let detail = new PayPalPaymentDetails(String(final), '0.00', '0.00');
        let payment = new PayPalPayment(String(final), 'USD', `Payment for $${this.api.order.name}`, 'Order', detail);
        this.payPal.renderSinglePaymentUI(payment).then((response) => {
          console.log('payment done');
          this.api.paid().then(resp=>{
            this.spinner.dismiss();
            this.helper.presentToast(`Payment successful!`);
            console.log(resp);
            this.navCtrl.push('SummaryPage', resp.id).then(R=>{
              this.api.resetOrder();
              this.api.resetCart();
              
            });
          }, errx=>{ 
            this.helper.presentTopToast(`Error in loadin Paypal`)
          })
        }, () => {
          console.log('erro ao renderizar o pagamento do paypal');
          this.helper.presentToast('ERROR ! Running Paypal '+(final));
        })
      }).catch(err=> this.helper.presentToast(err))
    }).catch(err=> this.helper.presentToast(err))





  }
  else if(this.method == 'credit-card'){
    let final = this.api.order.total + this.api.order.tax;
    
// PAYMENT INTEGRATION 

this.openModal('CreditcardPage', {final: final});


// let card = {
//   number: '4242424242424242',
//   expMonth: 12,
//   expYear: 2020,
//   cvc: '220'
//  };

 }
  else{
    this.helper.presentCustomToast(`Please Select a Payment method`,1600, 'top')

  }

}



calculate(){
  console.log(this.total);    
  this.api.order.cart = this.api.cart;
  console.log(this.api.cart);    
  let cart = this.api.cart;
  let total =0;
for(let i=0; i < this.api.cart.length; i++ ){
 console.log(this.api.cart[i]);
 let variantTotal=   this.api.getMultiVariantPrice(this.api.cart[i].variants);
 cart[i].price = cart[i].price + variantTotal;
 console.log(cart[i].price) //per unit price with variants 
 this.total = this.total + cart[i].price * cart[i].quantity;
}
     console.log(this.total)
     console.log(this.api.order.cart);
       this.api.order.total = this.total;
       //now calulating TAX 
      let taxCalc = this.api.order.total * this.api.order.tax;
      this.api.order.tax = taxCalc;
      this.final = this.api.order.total + this.api.order.tax;
      return this.final;
}


  



  saveToLocal(order){
   let ord= JSON.parse(localStorage.getItem('orders'));
    if(!ord){
      console.log(`no orders placed already adding them `);
      let orders=[];
      orders.push(order);
      localStorage.setItem('orders',JSON.stringify(orders) )
    }else{
      ord.push(order);
      localStorage.setItem('orders', JSON.stringify(ord));
    }
  }

  
  openModal(pageName, data) {
    this.modalCtrl.create(pageName, {data:data}, { cssClass: 'inset-modal'}).present();
  }
}
