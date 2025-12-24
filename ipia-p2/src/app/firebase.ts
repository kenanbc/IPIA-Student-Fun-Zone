import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyAsoOjglV8RMJoPWlnYKdym4M-m3ANAI10",
    authDomain: "wp-2-ipia.firebaseapp.com",
    projectId: "wp-2-ipia",
    storageBucket: "wp-2-ipia.firebasestorage.app",
    messagingSenderId: "569844800410",
    appId: "1:569844800410:web:8943199510a184ed343823",
    measurementId: "G-74FQYHJEQF"
  };

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);

