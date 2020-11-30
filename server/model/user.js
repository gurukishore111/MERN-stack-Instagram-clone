const  mongoose  = require("mongoose");
const {ObjectId} = mongoose.Schema.Types;

const userSchema  = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    password:{
       type:String,
       required:true  
    },
    followers:[
        {
            type:ObjectId,
            ref:'User'
        }
    ],
    Profilephoto:{
        type:String,
        default:'https://th.bing.com/th/id/OIP.LkpSEm8JgA2JCF7BBuw6RwHaHa?pid=Api&w=197&h=197&c=7'
    },
    following:[
        {
            type:ObjectId,
            ref:'User'
        }
    ]
})

module.exports = mongoose.model('User',userSchema)