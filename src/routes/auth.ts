var express = require('express');
var router = express.Router();

import verify  from "../utils/verify";
import admin from '../adminFirebase'

router.get("/getUser",(req,res) => {
  verify(req.headers.idtoken).then(uid => {

    admin.auth().getUser(uid)
    .then(function(userRecord) {
      console.log('Successfully fetched user data:', userRecord.toJSON());
      res.json(userRecord.toJSON());
    })
    .catch(function(error) {
      console.log('Error fetching user data:', error);
    });
    
  });

});
router.get("/getUID",(req,res) => {
  let token =  req.headers.authorization;
    verify(token).then(uid => {
      //console.log("UID = ", uid);
      res.send({userID: uid});
    });
});

module.exports = router;

