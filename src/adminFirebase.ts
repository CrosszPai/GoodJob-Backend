import admin from 'firebase-admin'

admin.initializeApp({
  credential: admin.credential.cert({
    clientEmail:process.env.client_email,
    privateKey:process.env.private_key,
    projectId:process.env.project_id,
  }),
  databaseURL: process.env.firebase_db,
  projectId: process.env.project_id
});

export default admin;
