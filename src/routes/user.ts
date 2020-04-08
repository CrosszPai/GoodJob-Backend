var express = require('express');
var router = express.Router();

import verify  from "../utils/verify";

var fs = require('fs');
let rawdata = fs.readFileSync('./src/database.json');
let database = JSON.parse(rawdata);
import admin from '../adminFirebase'

router.get("/createNewUser",(req,res) => {
    var newUser = {
        uid : "asdaw51adasafagsf",
        email : "test@test.com",
        photoURL : ""
    }
    verify(req.headers.idtoken).then(uid => {

        admin.auth().getUser(uid)
        .then(function(userRecord) {
            newUser.uid = userRecord.uid;
            newUser.email = userRecord.email;
            newUser.photoURL = userRecord.photoURL;
            database.push(newUser);
            fs.writeFile('./src/database.json', JSON.stringify(database), (err) => {
                console.log(err);
            });
            res.send(database);
        })
        .catch(function(error) {
          console.log('Error fetching user data:', error);
        });
        
      });
});




module.exports = router;