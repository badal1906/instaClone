import firebase from "firebase";


const firebaseApp = firebase.initializeApp({
    apiKey: "AIzaSyBA98ayssriZQxI42KV6yxiOUppkO18rsg",
    authDomain: "insta-clone-36e3e.firebaseapp.com",
    projectId: "insta-clone-36e3e",
    storageBucket: "insta-clone-36e3e.appspot.com",
    messagingSenderId: "132788535579",
    appId: "1:132788535579:web:6501dc708577c9b946d3be"
}
);

const db = firebase.firestore();
const auth = firebase.auth();
const storage = firebase.storage();

export { db,auth,storage };