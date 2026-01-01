import { Injectable, signal } from '@angular/core';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, onAuthStateChanged, User } from 'firebase/auth';
import { auth } from './firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from './firebase';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  user = signal<User | null>(null);
  userProfile = signal<any | null>(null);
  private authLoadedPromise: Promise<void>;
  private authStateLoaded = false;

  constructor() {
    this.authLoadedPromise = new Promise((resolve) => {
      onAuthStateChanged(auth, async (user) => {
        this.user.set(user);
        if (user) {
          const profile = await this.getUserProfile(user.uid);
          this.userProfile.set(profile);
        } else {
          this.userProfile.set(null);
        }
        if (!this.authStateLoaded) {
          this.authStateLoaded = true;
          resolve();
        }
      });
    });
  }

  authLoaded(): Promise<void> {
    return this.authLoadedPromise;
  }

  async login(email: string, password: string) {
    await signInWithEmailAndPassword(auth, email, password);
    // Sačekaj da se userProfile ažurira nakon logina
    await this.waitForUserProfile();
  }

  private waitForUserProfile(): Promise<void> {
    return new Promise((resolve) => {
      const checkProfile = () => {
        if (this.userProfile() !== null) {
          resolve();
        } else {
          setTimeout(checkProfile, 50);
        }
      };
      checkProfile();
    });
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
  console.log(snap.data());
  return snap.data();
}

async register(firstName: string, lastName: string, email: string, password: string, avatarId: string, studyProgram: string, yearOfStudy: number | null) {
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  const user = userCredential.user;
  
  const userProfile = {
    firstName,
    lastName,
    email,
    avatarId,
    studyProgram,
    yearOfStudy
  };
  
  await setDoc(doc(db, 'users', user.uid), userProfile);
  this.userProfile.set(userProfile);
}

async updateProfile(uid: string, profileData: any) {
  await setDoc(doc(db, 'users', uid), profileData, { merge: true });
  this.userProfile.set({ ...this.userProfile(), ...profileData });
}
}
