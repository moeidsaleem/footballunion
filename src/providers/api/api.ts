import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';
import { AngularFireStorage, AngularFireUploadTask } from 'angularfire2/storage';
import { Headers, Http, RequestOptions, Response } from "@angular/http";

/*
  Generated class for the ApiProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class ApiProvider {
  serverUrl='http://ec2-13-229-128-0.ap-southeast-1.compute.amazonaws.com:3001/'

  user;
  selectedPackage:any;
  constructor(private afs:AngularFirestore,private http:Http,
     private afStorage:AngularFireStorage) {
    console.log('Hello ApiProvider Provider');
  }


  /* ----------GENERAL PUBLIC-------------- */
getTypeVideos(type){ /* type == 'attacker' || 'mid-fielder' || 'goal-keeper' */
  return this.afs.collection('videos', ref=>ref.where('type','==',type)).snapshotChanges();
}
getTrending(){
  return this.afs.collection('videos', ref=>ref.where('trending','==',true)).snapshotChanges();
}





/* -------------------------- Footballer ------------------ */

// get Footballer
 getFootballer(id){
   return this.afs.doc('footballers/'+id).valueChanges();
 }


 getClubFootballers(clubId){
   return this.afs.collection('footballers', ref=> ref.where('clubId','==',clubId)).snapshotChanges();

 }

 getFilterFootballers(name, age, skill,area){
   
   if(name && age && skill){
    return this.afs.collection('footballers', ref=> ref.where('name','==',name).where('age','<=',age).where('type','==',skill)).snapshotChanges();
   }else if(name!=='' && age==(null || 0) && skill == ''){
        return this.afs.collection('footballers', ref=> ref.where('name','==',name)).snapshotChanges();
  }else if(name=='' && age!==0 && skill==''){
    return this.afs.collection('footballers', ref=> ref.where('age','<=',age)).snapshotChanges();

  }
  else if(name=='' && age!==(null || 0) && skill!==''){
    return this.afs.collection('footballers', ref=> ref.where('age','<=',age).where('type','==',skill)).snapshotChanges();
  }else if(name =='' && age==(null || 0) && skill ==''){
    return this.afs.collection('footballers').snapshotChanges();
  }else if(name=='' && age==(null || 0) && skill!==''){
    return this.afs.collection('footballers', ref=> ref.where('type','==',skill)).snapshotChanges();

  }else{
    return this.afs.collection('footballers').snapshotChanges();
  }
 }
 //get All Footballers
 getFootballers(){
   return this.afs.collection('footballers').snapshotChanges();
 }
 //add Footballer
 addFootballer(id, data){
   return this.afs.doc('footballers/'+id).set(data)
 }
 //delete Footballer
 deleteFootballer(id){
   return this.afs.doc('footballers/'+id).delete();
 }
 //update Footballer
 updateFootballer(id, data){
   return this.afs.doc('footballers/'+id).update(data);
 }

 getClubRequests(clubId){
   return this.afs.collection('requests', ref=>ref.where('clubId','==',clubId)).snapshotChanges();
 }

/* -------------------------- CLUB ------------------ */

// get Club
getClub(id){
  return this.afs.doc('clubs/'+id).valueChanges();
}
//get All CLubs
getClubs(){
  return this.afs.collection('clubs').snapshotChanges();
}
//add Club
addClub(id,data){
  return this.afs.doc('clubs/'+id).set(data)
}
//delete CLub
deleteClub(id){
  return this.afs.doc('clubs/'+id).delete();
}
//update Footballer
updateClub(id, data){
  return this.afs.doc('clubs/'+id).update(data);
}

// generateClubRequest(data){
//   return this.afs.collection('requests').add(data);
// }
/* --------------------------VIDEOS------------------- */
getVideos(){
  return this.afs.collection('videos').snapshotChanges();
}
getVideo(id){
  return this.afs.doc('videos/'+id).valueChanges();
}
getFootballerVideos(footballerId){
  if(!footballerId){
    console.log(`no footballerId found`);
  }
    return this.afs.collection('videos', ref=> ref.where('footballerId','==',footballerId)).snapshotChanges()


}
addVideo(data){
  return this.afs.collection('videos').add(data)
}
deleteVideo(id){
  return this.afs.doc('videos/'+id).delete();
}
updateVideo(id, data){
  return this.afs.doc('videos/'+id).update(data);
}


//UPLOADING FUNCTIONS
getStorageVideos(id){

}

getTrendingVideos(){
  return this.afs.collection('videos', ref=> ref.where('trending', '==',true)).snapshotChanges();
}



// uploadVideo(data): AngularFireUploadTask{
//   let newName = `${new Date().getTime()}.mp4`;
//   let footballerId = JSON.parse(localStorage.getItem('data')).uid;
//    return this.afStorage.ref(`videos/${newName}`).putString(data);
// }
storeInfoToDatabase(metaInfo, data){
  let toSave={
    created:metaInfo.timeCreated,
    url: metaInfo.downloadURLs[0],
    fullPath: metaInfo.fullPath,
    contentType: metaInfo.contentType,
    footballerId:'',
    title: data.title || '',
    type:data.type || '',
    thumbnail: data.thumbnail || '',
  }
  toSave.footballerId = JSON.parse(localStorage.getItem('data')).uid;
  return this.addVideo(toSave);
}
// Delete Storage Video
deleteStorageVideo(file){
  let key = file.key;
  let storagePath = file.fullPath;
  //remove from firestore
  this.deleteVideo(key);
  //remove from storage
  return this.afStorage.ref(storagePath).delete();
}

/* ------------------- MATCHES------------------ */
setMatch(data){
  return this.afs.collection('matches').add(data);

}
updateClubMatch(id,data){
  let match= data;
  return this.afs.doc('clubs/'+id).update({
    match: data
  });
}
//getFootballerClub Requets

getRequests(footballerId){
  return this.afs.collection('requests', ref=> ref.where('footballerId','==',footballerId)).snapshotChanges();
}

//get type request 
getTypeRequests(type){
  if(!type){
    
    return this.afs.collection('requests').snapshotChanges();

  }else{
    return this.afs.collection('requests', ref=>ref.where('type','==',type).where('status','==','pending')).snapshotChanges();

  }
}





// Send Club Join request --club to player
sendJoinRequest(data){
  let clubId =JSON.parse(localStorage.getItem('data')).uid;
  let request ={
    message: data.message || `We love your performance and want you to join it`,
    footballerId:data.footballerId,
    clubId: clubId,
    status:'pending'
  }
  return this.afs.collection('requests').add(request);
}




generateJoinRequest(data){
    return this.afs.collection('requests').add(data);
  
}


// Accept Footballer Request
acceptClubRequest(request){


 
 
  //now set footballer clubId 

}



deleteRequest(key){
  return this.afs.doc('requests/'+key).delete();
}

updateRequest(key,data){
  return this.afs.doc('requests/'+key).update(data);
}


//LOGIN TOKEN 


/* PACKAGES */
getPackages(){
  return this.afs.collection('packages').snapshotChanges();
}



sendPaymentToken(token, amount){
  let headers = new Headers();
  headers.append('Content-Type', 'application/json');
//  let tokenId = token.card.id;
  return this.http.post(this.serverUrl + 'payment', {stripeToken:token, amount: amount}, {headers:headers})
  .map((response:Response)=> response.json())
}

}
