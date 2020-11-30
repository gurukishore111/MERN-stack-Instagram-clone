import React, { useState,useEffect } from 'react';
import { Link ,useHistory } from 'react-router-dom';
import M from "materialize-css";
function Signup() {
  const history = useHistory();
  const [name,setname] = useState("");
  const [password,setpassword] = useState("");
  const [email,setemail] = useState("");
  const [image,setImage] = useState("");
  const [url,setUrl] = useState(undefined);
  useEffect(()=>{
     if(url){
       uploadFields();
     }
  },[url])
  const UploadProfile = async () =>{
    // const data = new FormData();
    // data.append('file',image)
    // data.append('upload_present','instaclone')
    // // data.append('cloud_name','gk1')
    // fetch('https://api.cloudinary.com/v1_1/gk1/image/upload',{
    //     method:'POST',
    //     body:data
    // }).then(res =>res.json()).then(data=>{
    //    //console.log(data)
    // }).catch(err =>{
    //    //console.log(err)
    // })
    //------------------------------
    const data = new FormData();
    data.append('file', image);
    data.append('upload_preset', 'instaclone');
    await fetch('https://api.cloudinary.com/v1_1/gk1/image/upload', {
      method: 'POST',
      body: data
    }).then(res => res.json()).then(
        data =>{
          setUrl(data.url);
         //console.log(data)
        }
    ).catch(err =>{
       //console.log(err)
    });
}
  const uploadFields = () =>{
    if(!/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email)){
        M.toast({html:'Invalid Email',classes:'#c62828 red darken-1'})
        return 
    }
    fetch('https://insta-backend123.herokuapp.com/signup',{
      method:"post",
      headers:{
        'Content-Type':"application/json"
      },
      body:JSON.stringify({
        name:name,
        password:password,
        email:email,
        photo:url
      })
    }).then(res =>res.json()).then(data =>{
      if(data.error){
        M.toast({html:data.error,classes:'#c62828 red darken-1'})
      }else{
        M.toast({html:data.message,classes:'#b9f9ca green accent-2'})
        history.push('/login')
      }
    }).catch(err =>{
     //console.log(err)
    })
  } 
  const PostData = () =>{
    if(image){
      UploadProfile()
    }else{
       uploadFields()
    }
  }
 
    return (
        <div className="mycard">
           <div className="input-field card auth-card">
        <div className="card-content">
          <span className="card-title">Instagram</span>
          <input  type="text" placeholder="User name" value={name} onChange={(e) =>setname(e.target.value)} />
          <input type="email" required placeholder="Email" value={email} onChange={(e) =>setemail(e.target.value)}/>
          <input  type="password" placeholder="Password" value={password} onChange={(e) =>setpassword(e.target.value)}/>
          <div className="file-field input-field">
            <div className="btn red lighten-3">
            <span>Upload Profile picture (optional)</span>
            <input type="file"  onChange={(e) => setImage(e.target.files[0])} />
       </div>
        <div className="file-path-wrapper">
            <input className="file-path validate" type="text" />
        </div>
        </div>
          <button className="btn waves-effect waves-light red lighten-3" style={{marginTop:12}} type="submit" name="action" onClick={PostData}>Sign up
        </button>
        <h5>
            <Link to="/login" style={{fontSize:12}}>Already have an account ?</Link>
        </h5>
           </div>
      </div>
        </div>
    )
}

export default Signup
