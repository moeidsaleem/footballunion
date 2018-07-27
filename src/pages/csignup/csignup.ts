import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Validators, FormBuilder, FormGroup, FormControl } from '@angular/forms';

import { PasswordValidator } from '../../validators/password.validator';
import { AuthProvider } from '../../providers/auth/auth';
import { ApiProvider } from '../../providers/api/api';
import { SpinnerProvider } from '../../providers/spinner/spinner';
import { HelpersProvider } from '../../providers/helpers/helpers';
import { Facebook, FacebookLoginResponse } from '@ionic-native/facebook';


@IonicPage()
@Component({
  selector: 'page-csignup',
  templateUrl: 'csignup.html',
})
export class CsignupPage {
 

  //need to change to signup
  login:FormGroup;


  constructor(public navCtrl: NavController,private spinner:SpinnerProvider, private helper:HelpersProvider,private fb:Facebook,
     public navParams: NavParams, public formBuilder: FormBuilder,
    private auth:AuthProvider,private api:ApiProvider) {
    this.createForm();
  }
  createForm() {
    this.login = this.formBuilder.group({
      email: ['', Validators.compose([
            Validators.required,
            Validators.email,
            //Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$') 
      ])],
      password: ['', Validators.compose([
        Validators.required,
        Validators.minLength(6),
        //Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$') 
  ])],
    });
  }
  user:any;
  submit(value){
    this.spinner.load();
    console.log(value);
    this.auth.signupClub(value.email, value.password).then(user=>{
      this.user =user;
      let data={clubId:this.user.uid, email:value.email,password:value.password, accountType:'club', premium:false, package:{
          startDate:"", endDate:"", subscriptionId:"", subscription:"",paidAmount:0 
      }
    };
      this.api.addClub(data.clubId, data).then(response=>{
        console.log(`club added `);
        //time to save locals
        this.auth.saveClubLocalTokens(data);
        this.navCtrl.setRoot('MainPage');
        this.spinner.dismiss();
      })
    })

  }


  ionViewDidLoad() {
    console.log('ionViewDidLoad FloginPage');
  }

  nextPage() {
    this.navCtrl.push('FsignupPage');
  }

  facebookLogin(){
    this.fb.login(['email','public_profile', 'user_friends', 'email'])
    .then((res: FacebookLoginResponse) => {
      console.log('Logged into Facebook!', res);
      this.fb.api('me?fields=id,name,email,first_name,picture.width(600).height(600).as(picture_large)',[]).then(profilex=>{
        let profile = {name:profilex['name'], email: profilex['email'], photo:profilex['picture_large']['data']['url']}

      
      
      //first will check if id is still available. 
      if(res.authResponse.userID){ /* if a valid facebook user  */
        this.api.getClub(res.authResponse.userID).subscribe(user=>{  
          if(user){  /* if a valid database user  */
              this.api.user = user;
            this.auth.saveClubLocalTokens(this.api.user);
          console.log(`club logged In `);
           //now if the club has premium:true
           this.spinner.dismiss();
        if(this.api.user.premium == true){
          this.navCtrl.setRoot('HomePage')
        }else{
          this.navCtrl.setRoot('MainPage');
        }
        }else{  /* if not a valid user then sign up */


          this.helper.presentToast(`Registering Social User..`);
          let data={ name:profile.name,clubId: res.authResponse.userID, email:profile.email,password:'',photo: profile.photo,accountType:'club', 
          premium:false, 
          package:{
            startDate:"", endDate:"", subscriptionId:"", subscription:"",paidAmount:0 
        }
      };
          this.api.addClub(res.authResponse.userID, data).then(()=>{
            console.log(`club added `);
            //time to save locals
            this.auth.saveClubLocalTokens(data);
            this.navCtrl.setRoot('MainPage');
            this.spinner.dismiss();
          })
        }
        })
      }else{
   
      }

    },err=>{
      console.log(err);
      this.helper.presentToast(`Error loading Facebook Graph API data..`)
    });

    })
    .catch(e =>{ 
      console.log('Error logging into Facebook', e);
      this.helper.presentCustomToast(`Error fbLogin:${String(e)} `, 7000, 'top')
    });
  
  this.fb.logEvent(this.fb.EVENTS.EVENT_NAME_ADDED_TO_CART);
  }




  loginWithGoogle(){
    return this.auth.googleLogin().then(resp=>{
      console.log(`user logged In`)
      console.log(resp.uid);

       // This gives you a Google Access Token. You can use it to access the Google API.
  var token = resp.credential.accessToken;
  // The signed-in user info.
  this.api.user = resp.user;
      
      //first will check if id is still available. 
      if(this.api.user.uid){ /* if a valid facebook user  */
        this.api.getClub(this.api.user.uid).subscribe(user=>{  
          if(user){  /* if a valid database user  */
              this.api.user = user;
            this.auth.saveClubLocalTokens(this.api.user);
          console.log(`club logged In `);
           //now if the club has premium:true
           this.spinner.dismiss();
        if(this.api.user.premium == true){
          this.navCtrl.setRoot('HomePage')
        }else{
          this.navCtrl.setRoot('MainPage');
        }
        }else{  /* if not a valid user then sign up */
          this.helper.presentToast(`Registering Social User..`);
          let data={ name:this.api.user.displayName,clubId: this.api.user.uid, email:this.api.user.email,password:'',photo: this.api.user.photoURL,accountType:'club', 
          premium:false, 
          package:{
            startDate:"", endDate:"", subscriptionId:"", subscription:"",paidAmount:0 
        }
      };
          this.api.addClub(this.api.user.uid, data).then(()=>{
            console.log(`club added `);
            //time to save locals
            this.auth.saveClubLocalTokens(data);
            this.navCtrl.setRoot('MainPage');
            this.spinner.dismiss();

          })
        }
        })
           
      }else{
        this.helper.presentTopToast(`no uid found`)
      }

    }
    ,err=>{
      console.log(err);
      this.helper.presentToast(err)
    }).catch(e =>{ 
      console.log('Error logging into Google', e);
      this.helper.presentCustomToast(`Error Google :${String(e)} `, 7000, 'top')
    });
  }


}
