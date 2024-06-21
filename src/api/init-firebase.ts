import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyBbSunDA6H1DciaN9D_dDzIaueO-QTMFvQ",
    authDomain: "test-project-25614.firebaseapp.com",
    projectId: "test-project-25614",
    storageBucket: "test-project-25614.appspot.com",
    messagingSenderId: "438862607850",
    appId: "1:438862607850:web:0bde2d1d72609434e5ee93"
  };

export const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);