// Import the functions you need from the SDKs you need
import { getApp, getApps, initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyAYCzhkuIItTI-v7w0IXd-uh48b0mUUz2c",
    authDomain: "random-text-64025.firebaseapp.com",
    projectId: "random-text-64025",
    storageBucket: "random-text-64025.appspot.com",
    messagingSenderId: "1084865872553",
    appId: "1:1084865872553:web:a81569b4ce2f814dd25fb8",
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
