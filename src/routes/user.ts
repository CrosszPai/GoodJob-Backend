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
router.post("/updatePhotoURL",(req,res) => {
    console.log(req.body.photoURL)
    res.send("200")
});
router.post("/updateFirstname",(req,res) => {
    console.log('Firstname = ',req.body)
    res.send(200)
});
router.post("/updateLastname",(req,res) => {
    console.log('Lastname = ',req.body)
    res.send(200)
});
router.post("/updateGender",(req,res) => {
    console.log('Gender = ',req.body)
    res.send(200)
});
router.post("/updateCurrentRole",(req,res) => {
    console.log('CurrentRole = ',req.body)
    res.send(200)
});
router.post("/updateCurrentProvince",(req,res) => {
    console.log('CurrentProvince = ',req.body)
    res.send(200)
});
router.post("/updateInterested",(req,res) => {
    console.log('Interested = ',req.body)
    res.send(200)
});
router.post("/updateIntroduce",(req,res) => {
    console.log('Introduce = ',req.body)
    res.send(200)
});
router.post("/updatePhoneNumber",(req,res) => {
    console.log('PhoneNumber = ',req.body)
    res.send(200)
});
router.post("/updateID_card",(req,res) => {
    console.log('ID_card = ',req.body)
    res.send(200)
});
router.post("/updateAge",(req,res) => {
    console.log('age = ',req.body)
    res.send(200)
});





module.exports = router;