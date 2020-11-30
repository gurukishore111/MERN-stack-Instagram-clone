import React from 'react';
import {Link, useHistory} from "react-router-dom";
import { UserContext } from '../App';
import Logo from "./screens/logo.png"
import { useContext,useRef,useEffect,useState } from 'react';
import SearchIcon from '@material-ui/icons/Search';
import M from 'materialize-css'

function Navbar() {
    const  searchModal = useRef(null)
    const [search,setSearch] = useState('')
    const [userDetails,setUserDetails] = useState([])
    const {state,dispatch} = useContext(UserContext);
    const history = useHistory();
    useEffect(()=>{
        M.Modal.init(searchModal.current)
    },[])
    const fetchUsers = (query)=>{
        setSearch(query)
        fetch('https://insta-backend123.herokuapp.com/search-users',{
          method:"post",
          headers:{
            "Content-Type":"application/json"
          },
          body:JSON.stringify({
            query
          })
        }).then(res=>res.json())
        .then(results=>{
        //console.log(results)
          setUserDetails(results.user)
        })
     }

    const renderLists=() =>{
        if(state){
            return[
               <li key="0"><SearchIcon fontSize="large" data-target="modal1" className="large material-icons modal-trigger" style={{color:"gray",marginTop:17}}/></li>,
               <li key="1"><Link  to="/profile">Profile</Link></li>,
               <li key="2"><Link to="/create">Create Post</Link></li>,
               <li key="3"><Link to="/myfollowerpost">My Following Posts</Link></li>,
               <li key="4"><button  className="btn waves-effect waves-light red lighten-3 buttton"  type="submit"  name="action" onClick={() =>{
                   localStorage.clear()
                   dispatch({type:'CLEAR'})
                   history.push('/login')
               }}>Logout
               </button></li>
            ]
        }
        else{
            return[
                <li key="5"><Link to="/login">Login</Link></li>,
                <li key="6"><Link to="/signup">Signup</Link></li>
            ]
        }
    }
    return (
        <nav>
        <div className="nav-wrapper white">
        <Link to={state ? "/" : "/signup"} className="brand-logo left"><img src={Logo} style={{width:50,height:50,marginTop:7,marginLeft:3}} /></Link>
        <ul id="nav-mobile" className="right">
           {renderLists()}
        </ul>
        </div>
        <div id="modal1" class="modal" ref={searchModal} style={{color:"black"}}>
          <div className="modal-content">
          <input
            type="text"
            placeholder="search users"
            value={search}
            onChange={(e)=>fetchUsers(e.target.value)}
            />
             <ul className="collection">
               {userDetails.map(item=>{
                 return <Link to={item._id !== state._id ? "/profile/"+item._id:'/profile'} onClick={()=>{
                   M.Modal.getInstance(searchModal.current).close()
                   setSearch('')
                 }}><li className="collection-item">{item.email}</li></Link> 
               })}
               
              </ul>
          </div>
          <div className="modal-footer">
            <button className="modal-close waves-effect waves-green btn-flat" onClick={()=>setSearch('')}>close</button>
          </div>
        </div>
       </nav>
    )
}

export default Navbar
