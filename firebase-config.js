import {initializeApp} from 'firebase/app'
import { getStorage } from "firebase/storage";
import {getFirestore} from 'firebase/firestore'


const firebaseConfig = {
  apiKey: "AIzaSyBxkw4tFYdNWM7aDe8ghbMn4vRG0O3N8OE",
  authDomain: "locapoll-ind.firebaseapp.com",
  projectId: "locapoll-ind",
  storageBucket: "locapoll-ind.appspot.com",
  messagingSenderId: "848438580248",
  appId: "1:848438580248:web:6d353d406cb218eb62df6d"
};


export const app = initializeApp(firebaseConfig)
export const storage = getStorage(app)
export const db = getFirestore(app)
