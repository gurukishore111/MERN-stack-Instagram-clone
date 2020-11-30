const jwt = require('jsonwebtoken');
const { JWY_SECRET } = require('../config/key');
const User = require('../model/user');

module.exports = (req,res,next) =>{
   const {authorization} = req.headers;
   if(!authorization){
      return res.status(401).json({error:"you must be login!"})
   }
   const token = authorization.replace("Bearer ","")
   jwt.verify(token,JWY_SECRET,(err,payload) =>{
       if(err){
       res.status(401).json({error:'you must login!'})
       }
   const {_id} = payload;
   User.findById(_id).then(userdata =>{
       req.user = userdata;
       next();
   })
   })
}