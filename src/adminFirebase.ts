import admin from 'firebase-admin'
// var serviceAccount = require("../src/config/firebaseAdminSDKConfig.json");
import serviceAccount from './config/sa.json'
admin.initializeApp({
  credential: admin.credential.cert({
    clientEmail:serviceAccount.client_email,
    privateKey:serviceAccount.private_key,
    projectId:serviceAccount.project_id,
  }),
  databaseURL: "https://testo-e0749.firebaseio.com",
  projectId: "testo-e0749"
});

export default admin;