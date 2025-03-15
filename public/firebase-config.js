// Import the functions you need from the SDKs you need
//import { initializeApp } from "firebase/app";
//import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyBGYwEXdlb98DMqMFebbpj_mTJxyFC-QLE",
    authDomain: "pomclear.firebaseapp.com",
    databaseURL: "https://pomclear-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "pomclear",
    storageBucket: "pomclear.firebasestorage.app",
    messagingSenderId: "883606921297",
    appId: "1:883606921297:web:0b36c52b4385a89a661870",
    measurementId: "G-PVZ68XQMVH"
};

// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);
const db = firebase.database();
  // Initialize Firebase
  //const app = initializeApp(firebaseConfig);
  //const analytics = getAnalytics(app);