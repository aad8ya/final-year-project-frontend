import { initializeApp } from "firebase/app";
import dotenv from 'dotenv';

dotenv.config();

const firebaseConfig = {

    apiKey: "AIzaSyCp_G1gLGTutTUvds1V5jtuDugQivDygLA",
  
    authDomain: "kct-final-year.firebaseapp.com",
  
    projectId: "kct-final-year",
  
    storageBucket: "kct-final-year.appspot.com",
  
    messagingSenderId: "673266487343",
  
    appId: "1:673266487343:web:288379096bc1af713376da"
  
  };
  

export const app = initializeApp(firebaseConfig);

// TODO: change url to env var
export const env = {
    url: process.env.REACT_APP_URL || 'http://localhost:5000'
}