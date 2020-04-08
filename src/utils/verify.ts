import admin from '../adminFirebase'

export default async function(idToken){
  const UID = await admin.auth().verifyIdToken(idToken)
    .then(function(decodedToken) {
      let uid = decodedToken.uid;
      //console.log("UID : ",uid);
      return uid;
  
    }).catch(error => {
      console.log(error);
    });
    return UID;
 }