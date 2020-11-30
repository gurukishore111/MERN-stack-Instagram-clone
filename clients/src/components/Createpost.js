import React,{useState,useEffect} from 'react'
import { Link ,useHistory } from 'react-router-dom';
import M from "materialize-css";

function Createpost() {
    const history = useHistory();
    const [title,setTitle] = useState("");
    const [body,setbody] = useState("");
    const [image,setImage] = useState("");
    const [url,setUrl] = useState("");

    useEffect(()=>{
        if(url){
            fetch('https://insta-backend123.herokuapp.com/createpost',{
                method:"post",
                headers:{
                  'Content-Type':"application/json",
                  'Authorization':'Bearer '+ localStorage.getItem('jwt')
                },
                body:JSON.stringify({
                  title:title,
                  body:body,
                  image:url
                })
              }).then(res =>res.json()).then(data =>{
                if(data.error){
                  M.toast({html:data.error,classes:'#c62828 red darken-1'})
                }else{
                  M.toast({html:"Created Post!",classes:'#b9f9ca green accent-2'})
                  history.push('/')
                }
              }).catch(err =>{
               //console.log(err)
              })
        }     
    },[url])
    const postDetails = async () =>{
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

    return (
        <div className="card input-filed" style={{margin:"10px auto" ,maxWidth:"500px",padding:"20px",textAlign:"center",marginTop:"10%"}}>
            <input type="text" placeholder="Caption" value={title} onChange={(e) =>setTitle(e.target.value)} />
            <input type="text" placeholder="Something about your post" value={body} onChange={(e) =>setbody(e.target.value)} />
            <div className="file-field input-field">
            <div className="btn red lighten-3">
            <span>Upload post</span>
            <input type="file"  onChange={(e) => setImage(e.target.files[0])} />
       </div>
        <div className="file-path-wrapper">
            <input className="file-path validate" type="text" />
        </div>
        </div>
        <button className="btn waves-effect waves-light red lighten-3" style={{marginTop:12}} onClick={()=>postDetails()} type="submit" name="action">Submit Post
        </button>
    </div>
    )
}

export default Createpost
