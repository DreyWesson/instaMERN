// import firebase from "firebase";
import firebase from "firebase/app";
import "firebase/firestore";
import "firebase/auth";
import "firebase/storage";

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCieCzS6duFxIxszYn--lmhqf6zEBzjH94",
  authDomain: "insta-343f8.firebaseapp.com",
  databaseURL: "https://insta-343f8.firebaseio.com",
  projectId: "insta-343f8",
  storageBucket: "insta-343f8.appspot.com",
  messagingSenderId: "111420370821",
  appId: "1:111420370821:web:a32e8d50a7246221515eec",
  measurementId: "G-CNGJFK6WLB",
};

firebase.initializeApp(firebaseConfig);

const db = firebase.firestore();
const auth = firebase.auth();
const storage = firebase.storage();

export { auth, storage };
export default db;
