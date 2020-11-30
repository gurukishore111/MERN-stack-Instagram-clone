const express = require('express');
const  mongoose  = require('mongoose');
const requireLogin = require('../middleware/requireLogin');
const router = express.Router();
const Post = require("../model/post");


router.get('/allpost',requireLogin,(req,res) =>{
     Post.find().populate('postedBy','_id name Profilephoto').populate('comments.postedBy','_id name').sort('-createdAt').then(posts =>{
         res.json({posts:posts})
     }).catch(err =>{
         console.log(err);
     })
})

router.post('/createpost',requireLogin,(req,res) =>{
    const {title,body,image} = req.body;
    //console.log(req.body)
    if(!title || !body || !image){
        res.status(422).json({error:"Please add all the fields"})
    }
    req.user.password = undefined;
    const post = new Post({
        title:title,
        body:body,
        image:image,
        postedBy:req.user
    })
    post.save().then(result =>{
        res.json({post:result})
    }).catch(err =>{
        console.log(err)
    });
})


router.get('/mypost',requireLogin,(req,res)=>{
    Post.find({postedBy:req.user._id})
    .populate('postedBy','_id name Profilephoto').then(mypost =>{
        res.json({mypost:mypost})
    }).catch(err =>{
        console.log(err)
    })
})


router.put('/like',requireLogin,(req,res)=>{
    console.log(req.body)
    Post.findByIdAndUpdate(req.body.postId,{
        $push:{likes:req.user._id}
    },{
        new:true
    }).exec((err,result)=>{
        if(err){
            return res.status(422).json({error:err})
        }else{
            res.json(result)
        }
    })
})

router.put('/unlike',requireLogin,(req,res)=>{
    Post.findByIdAndUpdate(req.body.postId,{
        $pull:{likes:req.user._id}
    },{
        new:true
    }).exec((err,result)=>{
        if(err){
            return res.status(422).json({error:err})
        }else{
            res.json(result)
        }
    })
})

router.put('/comment',requireLogin,(req,res)=>{
    console.log(req.body)
    const comment = {
        text:req.body.text,
        postedBy:req.user._id
    } 
    Post.findByIdAndUpdate(req.body.postId,{
        $push:{comments:comment}
    },{
        new:true
    })
    .populate('comments.postedBy','_id name')
    .populate('postedBy', '_id name')
    .exec((err,result)=>{
        if(err){
            return res.status(422).json({error:err})
        }else{
            res.json(result)
        }
    })
})

router.delete('/deletepost/:postId',requireLogin,(req,res)=>{
    Post.findOne({_id:req.params.postId}).populate('postedBy','_id').exec((err,post)=>{
        if(err || !post){
            return res.status(422).json({error:err})
        }
        if(post.postedBy._id.toString() === req.user._id.toString()){
           post.remove().then(result=>{
               res.json(result).catch(err=>{
                   console.log(err)
               })
           })
        }
    })
})

router.get('/followpost',requireLogin,(req,res) =>{
    Post.find({postedBy:{$in:req.user.following}}).populate('postedBy','_id name').populate('comments.postedBy','_id name').sort('-createdAt').then(posts =>{
        res.json({posts:posts})
    }).catch(err =>{
        console.log(err);
    })
})

module.exports = router;
