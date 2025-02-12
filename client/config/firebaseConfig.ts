import { initializeApp } from "firebase/app";
import { initializeAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";
//@ts-ignore
import { getReactNativePersistence } from '@firebase/auth/dist/rn/index.js';

const firebaseConfig = {
  apiKey: "AIzaSyAZhcN5mIjznU4GfS34_BFVlCgyFTO0P7k",
  authDomain: "lab09-23f9e.firebaseapp.com",
  databaseURL: "https://lab09-23f9e-default-rtdb.firebaseio.com",
  projectId: "lab09-23f9e",
  storageBucket: "lab09-23f9e.firebasestorage.app",
  messagingSenderId: "687701726331",
  appId: "1:687701726331:web:2c317a588673e12e903ede",
  measurementId: "G-7VHWZJ79HR",
};

export const FIREBASE_APP = initializeApp(firebaseConfig);
export const FIREBASE_AUTH = initializeAuth(FIREBASE_APP, {
  persistence: getReactNativePersistence(AsyncStorage),
});

export const FIREBASE_DB = getFirestore(FIREBASE_APP);
