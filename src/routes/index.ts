import express from "express";
import { add } from "../utils/add";
import swaggerUi from 'swagger-ui-express'

import swaggerDoc from './swaggerDoc.json'

var admin = require("firebase-admin");
var serviceAccount = require("../config/firebaseAdminSDKConfig.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://goodjob-273317.firebaseio.com",
  projectId: "goodjob-273317"
});


const app = express()

app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use('/api-docs', swaggerUi.serve)

app.get('/api-docs', swaggerUi.setup(swaggerDoc))


app.get('/', (req, res) => {
    res.send("Hello World")
})


app.get('/', (req, res) => {
    res.send(add('Hello ', 'World'))
})

app.post('/', (req, res) => {
    res.status(200)
        .json(req.body)
})


app.get("/verify",(req,res) => {
    admin.auth().verifyIdToken(req.headers.authorization)
  .then(function(decodedToken) {
    let uid = decodedToken.uid;

    console.log("UID : ",uid);

  }).catch(function(error) {
    // Handle error
    console.log(error);
  });
});


export default app