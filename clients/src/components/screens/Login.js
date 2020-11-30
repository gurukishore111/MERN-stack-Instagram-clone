import React ,{useState,useContext} from 'react';
import { Link,useHistory } from 'react-router-dom';
import M from "materialize-css";
import { UserContext } from '../../App';

function Login() {
  const {state,dispatch} = useContext(UserContext);
  const history = useHistory();
  const [password,setpassword] = useState("");
  const [email,setemail] = useState("");

  const PostData = () =>{
    if(!/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email)){
      M.toast({html:'Invalid Email',classes:'#c62828 red darken-1'})
      return 
  }
    fetch('https://insta-backend123.herokuapp.com/signin',{
      method:"post",
      headers:{
        'Content-Type':"application/json"
      },
      body:JSON.stringify({
        password:password,
        email:email
      })
    }).then(res =>res.json()).then(data =>{
      if(data.error){
        M.toast({html:data.error,classes:'#c62828 red darken-1'})
      }else{
        M.toast({html:'Successfully Signed In',classes:'#b9f9ca green accent-2'})
        //console.log(data);
        history.push('/')
        localStorage.setItem('jwt',data.token);
        localStorage.setItem('user',JSON.stringify(data.user));
        dispatch({type:'USER',payload:data.user})
      }
    }).catch(err =>{
     //console.log(err)
    })
  }
    return (
        <div className="mycard">
           <div className="input-field card auth-card">
        <div className="card-content">
          <span className="card-title ">Instagram</span>
          <input type="text" placeholder="Email" value={email} onChange={(e) =>setemail(e.target.value)} />
          <input  type="password" placeholder="Password" value={password} onChange={(e) =>setpassword(e.target.value)} />
          <button className="btn waves-effect waves-light red lighten-3" style={{marginTop:12}} type="submit" onClick={PostData} name="action">Login
        </button>
        <h5>
            <Link to="/signup" style={{fontSize:12}}>Don't have an account ?</Link>
        </h5>
           </div>
      </div>
        </div>
    )
}

export default Login
