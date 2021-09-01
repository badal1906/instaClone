import React, { useState, useEffect } from "react";
import "./App.css";
import { makeStyles } from "@material-ui/core/styles";
import Modal from "@material-ui/core/Modal";
import Post from "./Post";
import { db,auth } from "./firebase";
import { Button, Input } from "@material-ui/core";

function getModalStyle() {
  const top = 50;
  const left = 50;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

const useStyles = makeStyles((theme) => ({
  paper: {
    position: "absolute",
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: "2px solid #000",
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));

function App() {
  const classes = useStyles();
  // getModalStyle is not a pure function, we roll the style only on the first render
  const [modalStyle] = useState(getModalStyle);
  const [open, setOpen] = useState(false);
  const [openSignIn, setOpenSignIn] = useState(false);
  const [posts, setPosts] = useState([]);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [user,setUser] = useState(null);
  
  useEffect(()=>{
    const unsubscribe = auth.onAuthStateChanged((authUser)=>{
      if(authUser){
        //user has logged in
        console.log(authUser);
        setUser(authUser);
      }
      else{
        //user has logged out
        setUser(null);
      }
    })
// useEffect can be daid as a front end listener which listens for changes in ui
//the function inside useEffect in this case "onAuthStateChanged" is a backend listener 
//lets say we login and we update username but before running the update function detach the previous listener
//it just set up so we dont have duplicates adn then refire the code 
    return () =>{
      //perform some cleanup actions
      unsubscribe();
    }
  },[user,username])


  useEffect(() => {
    db.collection("Posts").onSnapshot((snapshot) => {
      setPosts(
        snapshot.docs.map((doc) => ({
          id: doc.id, //to get id from database
          post: doc.data(), //gives all the data
        }))
      ); //this will go into database and return the information stored
    });
    // every time new post is added this line of code will run
  }, []);

  const signUp = (event) => {
    event.preventDefault();

    auth.createUserWithEmailAndPassword(email,password)
    .then((authUser)=>{
      authUser.user.updateProfile({
        displayName:username, 
      })
    })
    .catch((error)=>alert(error.message));
  };

  const signIn = (event) =>{
    event.preventDefault();//prevents reload

    auth
    .signInWithEmailAndPassword(email,password)
    .catch((error) => alert(error.message))

    setOpenSignIn(false);//close modal after signIN 
  }

  return (
    <div className="App">
      
        <Modal open={open} onClose={() => setOpen(false)}>
        <div style={modalStyle} className={classes.paper}>
          <form className="app__signup">
            <center>
              <img
                className="app__headerImage"
                src = "data:image/png;base64,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"
                ></img>
            </center>

            <Input
              type="text"
              placeholder="username"
              value={username}
              onChange={(e) => setEmail(e.target.value)}
            ></Input>

            <Input
              type="email"
              placeholder="useremail"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            ></Input>

            <Input
              type="password"
              placeholder="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            ></Input>
            <Button type= "submit" onClick={signUp}>Sign up</Button>

          </form>
        </div>
      </Modal>


      <Modal 
      open={openSignIn} 
      onClose={() => setOpenSignIn(false)}>
        <div style={modalStyle} className={classes.paper}>
          <form className="app__signup">
            <center>
              <img
                className="app__headerImage"
                src = "data:image/png;base64,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"
                ></img>
            </center>

            <Input
              type="email"
              placeholder="useremail"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            ></Input>

            <Input
              type="password"
              placeholder="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            ></Input>
            <Button type= "submit" onClick={signIn}>Sign in</Button>

          </form>
        </div>
      </Modal>

      <div className="app__header">
        <img
          className="app__headerImage"
          src="data:image/png;base64,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"
        ></img>
      </div>
      {user ? (
      <Button onClick={() => auth.signOut()}>Signout</Button>)
      :
      (<div className="app__loginContainer">
      <Button onClick={() => setOpenSignIn(true)}>Sign in</Button>
      <Button onClick={() => setOpen(true)}>Sign up</Button>
      </div>
      )}
      
      

      {posts.map(({ id, post }) => (
        <Post
          key={id} //now that we have given it a key so it wont re render the whole post component
          //instead it will check for id and only render posts with unique keys
          username={post.username}
          caption={post.caption}
          imageURL={post.imageURL}
        />
      ))}
    </div>
  );
}

export default App;
