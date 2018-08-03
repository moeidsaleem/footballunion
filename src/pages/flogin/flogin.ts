import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Validators, FormBuilder, FormGroup, FormControl } from '@angular/forms';

import { PasswordValidator } from '../../validators/password.validator';
import { AuthProvider } from '../../providers/auth/auth';
import { ApiProvider } from '../../providers/api/api';
import { SpinnerProvider } from '../../providers/spinner/spinner';
import { HelpersProvider } from '../../providers/helpers/helpers';
import { Facebook, FacebookLoginResponse } from '@ionic-native/facebook';
import firebase from 'firebase';

@IonicPage()
@Component({
  selector: 'page-flogin',
  templateUrl: 'flogin.html',
})
export class FloginPage {
 

  //need to change to signup
  login:FormGroup;


  constructor(public navCtrl: NavController, private spinner:SpinnerProvider,private fb: Facebook,
     public navParams: NavParams, public formBuilder: FormBuilder,private helper:HelpersProvider,
    private auth:AuthProvider,private api:ApiProvider) {
    this.createForm();
  }
  createForm() {
    this.login = this.formBuilder.group({
      email: ['atrxifootballer@gmail.com', Validators.compose([
            Validators.required,
            Validators.email,
            //Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$') 
      ])],
      password: ['qwerty', Validators.compose([
        Validators.required,
        Validators.minLength(6),
        //Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$') 
  ])],
    });
  }


  userxx;
  submit(value){
    this.spinner.load();
    console.log(value);
    this.auth.loginFootballer(value.email, value.password).then(ux=>{
      this.userxx = ux;
      console.log(this.userxx);
      let data={footballerId:this.userxx.user.uid, email:value.email,password:value.password, accountType:'footballer'}
        console.log(`footballer logged In `);
        //time to save locals
        this.auth.saveLocalTokens(data.footballerId,'token-xxx',data.accountType);
        this.navCtrl.setRoot('FmyvideosPage').then(r=>{
          this.spinner.dismiss();
        });
    
    }).catch(err=>{
      this.spinner.dismiss();
      this.helper.presentToast(err.message);
    })

  }


  ionViewDidLoad() {
    console.log('ionViewDidLoad FloginPage');
  }

  nextPage() {
    this.navCtrl.push('FsignupPage');
  }


  facebookLogin(){
    let provider = new firebase.auth.FacebookAuthProvider();
    firebase.auth().signInWithRedirect(provider).then(()=>{
      firebase.auth().getRedirectResult().then(res=>{
          this.api.getFootballer(res.user.uid).subscribe(resp=>{
            if(resp){ /* if already in database user */
              let data={footballerId:res.user.uid, email:res.user.email,  password:'', accountType:'footballer'};
              console.log(`footballer logged In `);
              //time to save locals
              this.auth.saveLocalTokens(data.footballerId, res.user.refreshToken, data.accountType);
              this.navCtrl.setRoot('FmyvideosPage').then(r=>{
                this.spinner.dismiss();
              });

            }else{  /* if not a database user */
             this.helper.presentToast(`Registering Social User..`);
             this.api.addFootballer(res.user.uid, {
                        footballerId: res.user.uid,
                        accountType:'footballer',
                        loginMethod:'facebook',
                        password: res.user.refreshToken,
                        clubId:'',
                        name:res.user.displayName,
                        photo: res.user.photoURL,
                        email:res.user.email
                      }).then(()=>{
                        console.log(`footballer added `);
                        //time to save locals
                        this.auth.saveLocalTokens(res.user.uid, res.user.refreshToken,'footballer');
                        this.navCtrl.setRoot('FprofilePage')
                      })
                    }
                    })
        
      }, err=>{
         this.helper.presentToast(`Error retrieving data`)
      })
    }, error=>{
      this.helper.presentToast(`Error logging In With Facebook!`)
    })


  }
  // facebookLogin(){
  //   this.fb.login(['email','public_profile', 'user_friends', 'email'])
  //   .then((res: FacebookLoginResponse) => {
  //     console.log('Logged into Facebook!', res);
  //     this.fb.api('me?fields=id,name,email,first_name,picture.width(600).height(600).as(picture_large)',[]).then(profilex=>{
  //     let profile = {name:profilex['name'], email: profilex['email'], photo:profilex['picture_large']['data']['url']}
      
      
  //     //first will check if id is still available. 
  //     if(res.authResponse.userID){ /* if a valid facebook user  */
  //       this.api.getFootballer(res.authResponse.userID).subscribe(user=>{  
  //         if(user){  /* if a valid database user  */
  //         let data={footballerId:res.authResponse.userID, email:profile.email,password:res.authResponse.accessToken, accountType:'footballer'};
  //         console.log(`footballer logged In `);
  //         //time to save locals
  //         this.auth.saveLocalTokens(data.footballerId, res.authResponse.accessToken, data.accountType);
  //         this.navCtrl.setRoot('FmyvideosPage').then(r=>{
  //           this.spinner.dismiss();
  //         });

  //       }else{  /* if not a valid user then sign up */


  //         this.helper.presentToast(`Registering Social User..`);
  //         this.api.addFootballer(res.authResponse.userID, {
  //           footballerId: res.authResponse.userID,
  //           accountType:'footballer',
  //           password: res.authResponse.accessToken,
  //           clubId:'',
  //           name:profile.name,
  //           photo: profile.photo,
  //           email:profile.email
  //         }).then(()=>{
  //           console.log(`footballer added `);
  //           //time to save locals
  //           this.auth.saveLocalTokens(res.authResponse.userID, res.authResponse.accessToken,'footballer');
  //           this.navCtrl.setRoot('CprofilePage')
  //         })
  //       }
  //       })
           
  //     }else{

  //     }

  //   },err=>{
  //     console.log(err);
  //     this.helper.presentToast(`Error loading Facebook Graph API data..`)
  //   });

  //   })
  //   .catch(e =>{ 
  //     console.log('Error logging into Facebook', e);
  //     this.helper.presentCustomToast(`Error fbLogin:${String(e)} `, 7000, 'top')
  //   });
  
  // this.fb.logEvent(this.fb.EVENTS.EVENT_NAME_ADDED_TO_CART);
  // }



  
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
        this.api.getFootballer(this.api.user.uid).subscribe(user=>{  
          if(user){  /* if a valid database user  */
              this.api.user = user;
            this.auth.saveClubLocalTokens(this.api.user);
            this.auth.saveLocalTokens(this.api.user.uid, token,'footballer');

          console.log(`footballer logged In `);
           //now if the club has premium:true
           this.spinner.dismiss();
          this.navCtrl.setRoot('HomePage')
        
        }else{  /* if not a valid user then sign up */
          this.helper.presentToast(`Registering Social User..`);
          let data={ name:this.api.user.displayName,footballerId: this.api.user.uid, email:this.api.user.email,password:'',photo: this.api.user.photoURL,accountType:'footballer', 
      };
          this.api.addFootballer(this.api.user.uid, {
            footballerId: this.api.user.uid,
            accountType:'footballer',
            password: token,
            clubId:'',
            name:this.api.user.displayName,
            photo:this.api.user.photoURL,
            email:this.api.user.email
          }).then(()=>{
            console.log(`Footballer added `);
            //time to save locals
            this.auth.saveLocalTokens(this.api.user.uid, token,'footballer');
            this.navCtrl.setRoot('HomePage')
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
