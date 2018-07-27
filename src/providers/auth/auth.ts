import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import firebase from 'firebase';
import { GooglePlus } from '@ionic-native/google-plus';

/*
  Generated class for the AuthProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class AuthProvider {

  constructor(
    private afAuth:AngularFireAuth,
    private googlePlus:GooglePlus
  ) {
    console.log('Hello AuthProvider Provider');
  }

  /* -------------------------- Footballer Auth ------------------ */

  loginFootballer(email, password){
    return this.afAuth.auth.signInWithEmailAndPassword(email, password);
  }


  signupFootballer(email, password){
    let method = 'email';
    return this.afAuth.auth.createUserWithEmailAndPassword(email, password);
  }
  /* -------------------------- Footballer Auth ------------------ */
  loginClub(email, password){
    return this.afAuth.auth.signInWithEmailAndPassword(email, password);
  }
  signupClub(email, password){
    let method = 'email';
    return this.afAuth.auth.createUserWithEmailAndPassword(email, password);
  }
  signupGoogle(){
    
  }
 
  





/* Google Authentication */





googleLogin(): Promise<any> {
  return new Promise((resolve, reject) => { 
      this.googlePlus.login({
        'webClientId': '1098733280887-3ilcgk0kj4crpf7g8ooca5ic2pnagusv.apps.googleusercontent.com',
        'offline': true
      }).then( res => {
              const googleCredential = firebase.auth.GoogleAuthProvider
                  .credential(res.idToken);

              firebase.auth().signInWithCredential(googleCredential)
            .then( response => {
                console.log("Firebase success: " + JSON.stringify(response));
                resolve(response)
            });
      }, err => {
          console.error("Error: ", err)
          reject(err);
      });
    });
    }







  //TOKEN 
  getAuthToken(){
    let token=localStorage.getItem('token');
  return  this.afAuth.auth.signInAndRetrieveDataWithCustomToken(token);
  }

  saveLocalTokens(uid, token, accountType){
    let data = {
      "uid":uid, "token":token, "accountType":accountType}; 
    localStorage.setItem('data',JSON.stringify(data));
  }
  saveClubLocalTokens(data){
    data.uid = data.clubId;
       localStorage.setItem('data', JSON.stringify(data));
  }
  getLocalTokens(){
    //console.log(localStorage.getItem('data'))
   // console.log(JSON.parse(localStorage.getItem('data')))
    return JSON.parse(localStorage.getItem('data'));
  }
  clearLocalTokens(){
    return localStorage.removeItem('data');
  }


}
