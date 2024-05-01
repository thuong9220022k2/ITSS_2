import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAzIFux7ghDYJb6Tg_-1k-dSNSpnk2JwjY",
  authDomain: "todolist-e1b08.firebaseapp.com",
  databaseURL: "https://todolist-e1b08-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "todolist-e1b08",
  storageBucket: "todolist-e1b08.appspot.com",
  messagingSenderId: "18378078121",
  appId: "1:18378078121:web:b09131a695482f58fd76b8"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth();
export const storage = getStorage();
export const db = getFirestore()
