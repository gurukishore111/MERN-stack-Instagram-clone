const express = require('express');
const  mongoose  = require('mongoose');
const router = express.Router();
const User = require("../model/user")
const bcrypt = require('bcryptjs');
const { JWY_SECRET } = require('../config/key');
const jwt = require('jsonwebtoken');
const requireLogin = require('../middleware/requireLogin');


router.get('/',(req,res)=>{
    res.send('hello')
})


router.post('/signup',(req,res)=>{
   const {name,email,password,photo} = req.body; 
   if(!name || !email || !password){
     return res.status(422).json({error:'Please add all the fields'})
   }
   User.findOne({email:email}).then(savedUser =>{
       if (savedUser) {
         return res.status(422).json({error:'user already exists with this email!'})
       }
       bcrypt.hash(password,12).then(hashedpassword =>{
        const user = new User({
            email:email,
            password:hashedpassword,
            name:name,
            Profilephoto:photo
        })
 
        user.save().then(user =>{
            res.json({message:'Saved successfully!'})
        }).catch(err =>{
            console.log(err)
        })
       })
   }).catch(err =>{
       console.log(err)
   })
})

router.post('/signin',(req,res)=>{
     const {email,password} = req.body
     if(!email || !password){
         return res.status(422).json({error:'Please fill email and password!'})
     }
     User.findOne({email:email}).then(savedUser =>{
         if(!savedUser){
            return res.status(422).json({error:'Invalid Email or password'})
         }
        // console.log(savedUser)
         bcrypt.compare(password,savedUser.password).then(doMatch =>{
             if(doMatch){
                 const token = jwt.sign({_id:savedUser._id},JWY_SECRET)
                 const {_id,name,email,followers,following,Profilephoto} = savedUser;
                 res.json({token:token,user:{_id,name,email,followers,following,Profilephoto}})
             }
             else{
                 return res.status(400).json({error:"Invalid Email or password"})
             }
         })
     }).catch(err =>{
         console.log(err)
     })
})

module.exports = router;