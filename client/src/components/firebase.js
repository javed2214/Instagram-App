import firebase from 'firebase'
import 'firebase/storage'

var firebaseConfig = {
    apiKey: process.env.REACT_APP_API_KEY,
    authDomain: process.env.REACT_APP_AUTH_DOMAIN,
    projectId: process.env.REACT_APP_PROJECT_ID,
    storageBucket: "blog-app-8547b.appspot.com",
    messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
    appId: process.env.REACT_APP_APP_ID
  };
  // Initialize Firebase
const firebaseApp = firebase.initializeApp(firebaseConfig);

const storage = firebase.storage()
const db = firebaseApp.firestore()

export { storage, firebase as default, db }