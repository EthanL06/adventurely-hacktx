import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyCG8Gnoy5AQbBB6SebrZzfZLtmGyATlbYU",
    authDomain: "adventurely-6a92e.firebaseapp.com",
    projectId: "adventurely-6a92e",
    storageBucket: "adventurely-6a92e.appspot.com",
    messagingSenderId: "90529662385",
    appId: "1:90529662385:web:ec83b6949ba21f86256990",
    measurementId: "G-XSDHENSN2B"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
