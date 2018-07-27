import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';
import { AngularFireStorage, AngularFireUploadTask } from 'angularfire2/storage';

/*
  Generated class for the ApiProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class ApiProvider {
  user;
  constructor(private afs:AngularFirestore, private afStorage:AngularFireStorage) {
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
  return this.afs.collection('requests', ref=>ref.where('type','==',type).where('status','==','pending')).snapshotChanges();
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
  let clubId =JSON.parse(localStorage.getItem('data')).uid;
  let request ={
    description: data.description,
   // footballerId:data.footballerId,
    clubId: clubId,
    type:data.type,
    status:'pending',
    clubName:data.clubName
  }
  return this.afs.collection('requests').add(request);

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


}
