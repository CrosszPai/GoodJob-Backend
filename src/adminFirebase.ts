import admin from 'firebase-admin'
// var serviceAccount = require("../src/config/firebaseAdminSDKConfig.json");
import serviceAccount from './config/firebaseAdminSDKConfig.json'
admin.initializeApp({
  credential: admin.credential.cert({
    clientEmail:serviceAccount.client_email,
    privateKey:serviceAccount.private_key,
    projectId:serviceAccount.project_id,
  }),
  databaseURL: "https://goodjob-273317.firebaseio.com",
  projectId: "goodjob-273317"
});

export default admin;