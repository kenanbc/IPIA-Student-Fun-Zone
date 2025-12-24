import { Injectable, signal } from '@angular/core';
import { signInWithEmailAndPassword, signOut, onAuthStateChanged, User } from 'firebase/auth';
import { auth } from './firebase';
import { doc, getDoc } from 'firebase/firestore';
import { db } from './firebase';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  user = signal<User | null>(null);
  userProfile = signal<any | null>(null);

  constructor() {
    onAuthStateChanged(auth, async (user) => {
      this.user.set(user);
      if (user) {
        const profile = await this.getUserProfile(user.uid);
        this.userProfile.set(profile);
      } else {
        this.userProfile.set(null);
      }
    });
  }

  login(email: string, password: string) {
    return signInWithEmailAndPassword(auth, email, password);
  }

  logout() {
    return signOut(auth);
  }

  isLoggedIn() {
    return this.user() !== null;
  }


async getUserProfile(uid: string) {
  const docRef = doc(db, 'users', uid);
  const snap = await getDoc(docRef);
  return snap.data();
}

}
