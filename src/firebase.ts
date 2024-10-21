import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getDatabase } from 'firebase/database';
import { getAnalytics } from 'firebase/analytics';

const firebaseConfig = {
  apiKey: "AIzaSyDgX2KFCtIWUS4saSIaMA1CM6kf96MhyJ8",
  authDomain: "bigamtsk.firebaseapp.com",
  databaseURL: "https://bigamtsk-default-rtdb.firebaseio.com",
  projectId: "bigamtsk",
  storageBucket: "bigamtsk.appspot.com",
  messagingSenderId: "434468474758",
  appId: "1:434468474758:web:c527cb5cfe4c2c1553a607",
  measurementId: "G-VBMHHSQ6LN"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const database = getDatabase(app);
export const analytics = getAnalytics(app);