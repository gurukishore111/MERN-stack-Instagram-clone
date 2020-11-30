import React,{useEffect,useState,useContext} from 'react'
import { UserContext } from '../App'
import {useParams} from "react-router-dom";
import Loading from './Loading';

function UserProfile() {
    const [userprofile,setUserprofile] = useState(null);
    const {state,dispatch} = useContext(UserContext);
    const {userid} = useParams();
    const [followbtn,setfollowbtn] = useState(state? state.following.includes(userid) : true);
    //console.log(userid)
    useEffect(()=>{
        fetch(`https://insta-backend123.herokuapp.com/user/${userid}`,{
            headers:{
              'Authorization':'Bearer '+ localStorage.getItem('jwt')
            }
        }).then(res => res.json()).then(result=>{
          //console.log(result)  
           setUserprofile(result)
        })
    },[userid])
   //console.log(userprofile)

    const followUser = () =>{
        fetch(`https://insta-backend123.herokuapp.com/follow`,{
            method:'put',
            headers:{
                'Content-Type' : 'application/json',
                'Authorization':'Bearer '+ localStorage.getItem('jwt')
              },
            body:JSON.stringify({
                followId:userid
            })
        }).then(res =>res.json()).then(data =>{
           //console.log(data)
           dispatch({type:'UPDATE',payload:{following:data.following,followers:data.followers}})
           localStorage.setItem('user',JSON.stringify(data))
           setUserprofile((prevstate) =>{
               return {
                   ...prevstate,
                   user:{
                    ...prevstate.user,
                          followers:[...prevstate.user.followers,data._id]
                   }
               }
           })
           setfollowbtn(false)
        })
    }
    const unfollowUser = () =>{
        fetch(`https://insta-backend123.herokuapp.com/unfollow`,{
            method:'put',
            headers:{
                'Content-Type' : 'application/json',
                'Authorization':'Bearer '+ localStorage.getItem('jwt')
              },
            body:JSON.stringify({
                unfollowId:userid
            })
        }).then(res =>res.json()).then(data =>{
           //console.log(data)
           dispatch({type:'UPDATE',payload:{following:data.following,followers:data.followers}})
           localStorage.setItem('user',JSON.stringify(data))
           setUserprofile((prevstate) =>{
               const newFollower = prevstate.user.followers.filter(item => item !==data._id )
               return {
                   ...prevstate,
                   user:{
                    ...prevstate.user,
                          followers:newFollower
                   }
               }
           })
           setfollowbtn(true)
        })
    }
    return (
        <>
        {userprofile ? 
        <div style={{maxWidth:"550px",margin:"0px auto" }}>
            <div style={{
                display:"flex",
                justifyContent:"space-around",
                margin:"18px 0px",
                borderBottom:"1px solid lightgray"
            }}>
               <div>
                 <img className="profile_image" 
                 src={userprofile.user.Profilephoto ? userprofile.user.Profilephoto : 'https://th.bing.com/th/id/OIP.LkpSEm8JgA2JCF7BBuw6RwHaHa?pid=Api&w=197&h=197&c=7'} alt="profile" />
               </div>
               <div className="profile_info">
                   <h4>{userprofile.user.name}</h4> 
                   <h6 style={{marginBottom:12}}>{userprofile.user.email}</h6>
                   <div className="profile_follow">
                      <h5>{userprofile.posts.length} posts</h5>
                       <h5>{userprofile.user.followers.length} follower</h5>
                       <h5>{userprofile.user.following.length} following</h5>
                   </div>
                   {followbtn ? <button style={{margin:"10px"}} className="btn  waves-effect waves-light red lighten-3"  style={{marginTop:12}} type="submit" name="action" onClick={followUser}>Follow
     </button> : <button style={{margin:"10px"}} className="btn  waves-effect waves-light red lighten-3"  style={{marginTop:12}} type="submit" name="action" onClick={unfollowUser}>Unfollow
        </button>}
               </div>
            </div>
           {userprofile.posts && <div className="gallery">
                {userprofile.posts.map((item,index) =>(
                    <img src={item.image} alt="post" key={index} className="items" />
                ))}
            </div> }
        </div>
         :
         
         <Loading/> 
        }
        </>
    )
}

export default UserProfile
