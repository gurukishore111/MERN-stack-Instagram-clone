import React,{useEffect,useState,useContext} from 'react'
import { UserContext } from '../../App'

function Profile() {
    const [mypost,setmypost] = useState([])
    const {state,dispatch} = useContext(UserContext);
    const [image,setImage] = useState("");

    useEffect(()=>{
        fetch('https://insta-backend123.herokuapp.com/mypost',{
            headers:{
              'Content-Type':"application/json",
              'Authorization':'Bearer '+ localStorage.getItem('jwt')
            }
        }).then(res => res.json()).then(result=>{
            setmypost(result.mypost)
        })
    },[])
  ////console.log(state);
  useEffect(()=>{
    async function fetchData(){
        if(image){
            const data = new FormData();
            data.append('file', image);
            data.append('upload_preset', 'instaclone');
            await fetch('https://api.cloudinary.com/v1_1/gk1/image/upload', {
              method: 'POST',
              body: data
            }).then(res => res.json()).then(
                data =>{
                 //console.log(data)
                //   localStorage.setItem('user',JSON.stringify({...state,Profilephoto:data.url}))
                //   dispatch({type:'UPDATEPROFILE',payload:data.url})
                  fetch('https://insta-backend123.herokuapp.com/updateProfile',{
                      method:'put',
                      headers:{
                        'Content-Type':"application/json",
                        'Authorization':'Bearer '+ localStorage.getItem('jwt')
                      },
                      body:JSON.stringify({
                        photo:data.url
                      })
                  }).then(res =>res.json()).then(result =>{
                     //console.log(result)
                     localStorage.setItem('user',JSON.stringify({...state,Profilephoto:result.Profilephoto}))
                     dispatch({type:'UPDATEPROFILE',payload:result.Profilephoto})
                      window.location.reload();
                  })
                }
            ).catch(err =>{
               //console.log(err)
            });
          }
    }
    fetchData();
 },[image])
  const UpdateProfilePhoto = async (file) =>{
      setImage(file)
  } 
 
    return (
        <div style={{maxWidth:"550px",margin:"0px auto" }}>
            <div style={{
                display:"flex",
                justifyContent:"space-around",
                margin:"18px 0px",
                borderBottom:"1px solid lightgray"
            }}>
               <div>
                 <img className="profile_image"src={state? state.Profilephoto:'https://th.bing.com/th/id/OIP.LkpSEm8JgA2JCF7BBuw6RwHaHa?pid=Api&w=197&h=197&c=7'} alt="profile" />
               </div>
              
               <div className="profile_info">
                   <h4>{state && state.name}</h4>
                   <h6 style={{marginBottom:12}}>{state && state.email}</h6>
                   <div className="profile_follow">
                       <h5>{mypost.length} posts</h5>
                       <h5>{state ? state.followers.length : 0} follower</h5>
                       <h5>{state ?state.following.length : 0} following</h5>
                   </div>
                   <div className="file-field input-field" >
                    <div className="btn red lighten-3" style={{marginBottom:10}}>
                    <span>Edit Profile Picture</span>
                    <input type="file"  onChange={(e) => UpdateProfilePhoto(e.target.files[0])} />
                 </div>
                </div>
               </div>
            </div>
            <div className="gallery">
                {mypost.map((item,index) =>(
                    <img src={item.image} alt="post" key={index} className="items" />
                ))}
            </div>
        </div>
    )
}

export default Profile
