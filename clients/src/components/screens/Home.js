import React,{useEffect,useState,useContext} from 'react'
import { Favorite,ThumbDownAlt,ThumbUpAlt,Delete } from '@material-ui/icons';
import { UserContext } from './../../App';
import Loading from '../Loading';
import { Link } from 'react-router-dom';

function Home() {

    const [data,setData]  = useState([]);
    const {state,dispatch} = useContext(UserContext);
    useEffect(() =>{
     fetch('https://insta-backend123.herokuapp.com/allpost',{
       method:"GET",
       headers:{
           Authorization:'Bearer ' + localStorage.getItem('jwt')
       }
     }).then(res =>res.json())
     .then(result =>{
         //console.log(result)
        setData(result.posts)
     }).catch(err =>{
        //console.log(err);
     })    
    },[data])
    
   //console.log(data)

    const likepost = (id) =>{
       //console.log(id)
       fetch('https://insta-backend123.herokuapp.com/like',{
           method:'put',
           headers:{
            'Content-Type':"application/json",
            'Authorization':'Bearer '+ localStorage.getItem('jwt')
          },
          body:JSON.stringify({
              postId:id
          })
       }).then(res =>res.json).then(result=>{
        const newData = data.map(item =>{
            if(item._id == result._id){
                return result
            }else{
                return item
            }
        })
        setData(newData)
       }).catch(err =>{
          //console.log(err)
       })
    }

    const unlikepost = (id) =>{
        fetch('https://insta-backend123.herokuapp.com/unlike',{
            method:'put',
            headers:{
             'Content-Type':"application/json",
             'Authorization':'Bearer '+ localStorage.getItem('jwt')
           },
           body:JSON.stringify({
               postId:id
           })
        }).then(res =>res.json).then(result=>{
            const newData = data.map(item =>{
                if(item._id == result._id){
                    return result
                }else{
                    return item
                }
            })
            setData(newData)
        }).catch(err =>{
           //console.log(err)
        })
     }  

     const makeComment = (text,postId) => {
        //console.log(text,postId)
     fetch('https://insta-backend123.herokuapp.com/comment',{
         method:'put',
         headers:{
            'Content-Type':"application/json",
            'Authorization':'Bearer '+ localStorage.getItem('jwt') 
         },
         body:JSON.stringify({
                 postId:postId,
                 text:text
             })
     }).then(res =>res.json()).then(result=>{
       //console.log(result)
        const newData = data.map(item =>{
            if(item._id == result._id){
                return result
            }else{
                return item
            }
        })
        setData(newData)
    }).catch(err =>{
       //console.log(err)
    })
     }

     const deletepost = (postId) =>{
        const response = window.alert('Do you want to delete the post ?');
        if(response){
            fetch(`https://insta-backend123.herokuapp.com/deletepost/${postId}`,{
                method:'delete',
                headers:{
                'Authorization':'Bearer '+ localStorage.getItem('jwt')  
                }
            }).then(res => res.json())
            .then(result =>{
                const newData = data.filter(item =>{
                   return item._id !== result._id
                })
                setData(newData)
               //console.log(result)
            })
        }
     }

    //console.log(data)

    return (
        <div className="home">
            {data.length === 0 ? <Loading /> : <> 
                {data.map((item,index) =>(
           <div className="card home-card" key={index}>
                 <div className="post_profile">
                <img src={item.postedBy.Profilephoto} alt="post"  />
                <h5><Link to={`/profile/${item.postedBy._id}`}>{item.postedBy.name}</Link></h5>
                {item.postedBy._id  == state._id && <Delete  fontSize="small"  className="deleteIcon" onClick={() => deletepost(item._id)} />} 
                </div>
                <div className="card-image">
                <img src={item.image} alt="post" />
                </div>
                <div className="card-content input-field">
                <Favorite fontSize="small" style={{color:"red"}} /> 
                {item.likes.includes(state._id) ?  <ThumbDownAlt fontSize="small" onClick={() => {
                    unlikepost(item._id)
                }} style={{color:"gray"}} /> :
                <ThumbUpAlt fontSize="small"  style={{color:"gray"}} onClick={()=>{
                    likepost(item._id)
                }} />
                 }          
                     {item.likes.length === 0 ? " " :  <h6>{item.likes.length} likes</h6> }
                    <h4>{item.title}</h4>
                    <p>{item.body}</p>
                    {item.comments.length == 0 ? " " : <h3 style={{fontSize:16}}>Comments</h3>  }
                    
                    { item.comments && 
                        item.comments.map((rec,index )=>{
                          return <h6 style={{fontSize:13}} key={index}><span style={{fontWeight:800}}>{rec.postedBy.name}</span> {rec.text}</h6>
                        })
                    }
                    <form onSubmit={(e) =>{
                        e.preventDefault();
                        makeComment(e.target[0].value,item._id)
                    }}>
                    <input type="text" placeholder="Add a comment" />
                    </form>
                </div>
             </div>
            ))}
            </>}
            
            {/* <HomePost />
            <HomePost />
            <HomePost />
            <HomePost /> */}
        </div>
    )
}

export default Home
