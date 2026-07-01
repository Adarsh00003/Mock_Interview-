
import { initializeApp } from "firebase/app";
import {getAuth, GoogleAuthProvider} from "firebase/auth"
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_APIKEY,
  authDomain: "interviewiq-dcc7b.firebaseapp.com",
  projectId: "interviewiq-dcc7b",
  storageBucket: "interviewiq-dcc7b.firebasestorage.app",
  messagingSenderId: "333318099772",
  appId: "1:333318099772:web:aafa44e78cffac78890439"
};

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);

const provider = new GoogleAuthProvider()

export {auth , provider}