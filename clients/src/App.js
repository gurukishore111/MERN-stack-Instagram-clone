import React,{useEffect,useContext,createContext,useReducer} from "react";
import './App.css';
import Navbar from './components/Navbar';
import {BrowserRouter as Router,Route,Switch,useHistory} from "react-router-dom"
import Home from './components/screens/Home';
import Profile from './components/screens/Profile';
import Signup from './components/screens/Signup';
import Login from './components/screens/Login';
import Createpost from './components/Createpost';
import {reducer,initialState} from "./reducer/useReducer";
import UserProfile from './components/UserProfile';
import FollowerPost from './components/screens/FollowerPost';

export const UserContext = createContext();

const Routing = () =>{
  const history = useHistory();
  const {state,dispatch} = useContext(UserContext);

  useEffect(()=>{
    const user = JSON.parse(localStorage.getItem('user'))
   ////console.log(typeof user,user)
   if(user){
     dispatch({type:'USER',payload:user})
    //  history.push('/')
   }
   else{
     history.push('/login')
   }
  },[])
  return(
    <Switch>
          <Route path="/" component={Home} exact/>
          <Route path="/profile" component={Profile} exact/>
          <Route path="/create" component={Createpost} exact/>
          <Route path="/signup" component={Signup} exact/>
          <Route path="/login" component={Login} exact/>
          <Route path="/profile/:userid" component={UserProfile} exact/>
          <Route path="/myfollowerpost" component={FollowerPost} exact/>
     </Switch>
  )
}

function App() {
  const [state,dispatch] = useReducer(reducer,initialState)
  return (
    <UserContext.Provider value={{state,dispatch}}>
      <Router>
      <Navbar /> 
       <Routing />
      </Router>
      </UserContext.Provider>   
  );
}

export default App;
