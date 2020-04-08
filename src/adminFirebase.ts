var admin = require("firebase-admin");
var serviceAccount = require("../src/config/firebaseAdminSDKConfig.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://goodjob-273317.firebaseio.com",
  projectId: "goodjob-273317"
});

export default admin;