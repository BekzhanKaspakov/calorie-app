import { initializeApp } from "firebase/app";
import {
  getAuth,
  signInWithRedirect,
  signInWithPopup,
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";
import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  collection,
  getDocs,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBzbBZbOK4iCXaCm8Vh9mIrLKDhvE2NmrY",
  authDomain: "calorie-app-8ca05.firebaseapp.com",
  projectId: "calorie-app-8ca05",
  storageBucket: "calorie-app-8ca05.appspot.com",
  messagingSenderId: "972354149808",
  appId: "1:972354149808:web:fd2d01af89a545f23e8a75",
};

const firebaseApp = initializeApp(firebaseConfig);

const googleProvider = new GoogleAuthProvider();

googleProvider.setCustomParameters({
  prompt: "select_account",
});

export const auth = getAuth();
export const signInWithGooglePopup = () =>
  signInWithPopup(auth, googleProvider);
export const signInWithGoogleRedirect = () =>
  signInWithRedirect(auth, googleProvider);

export const db = getFirestore();

export const createUserDocumentFromAuth = async (
  userAuth,
  additionalInformation = { dailyCalorieLimit: 2100 }
) => {
  if (!userAuth) return;

  const userDocRef = doc(db, "users", userAuth.uid);

  const userSnapshot = await getDoc(userDocRef);

  if (!userSnapshot.exists()) {
    const { displayName, email } = userAuth;
    const createdAt = new Date();

    try {
      await setDoc(userDocRef, {
        displayName,
        email,
        createdAt,
        ...additionalInformation,
      });
    } catch (error) {
      console.log("error creating the user", error.message);
    }
  }

  return userDocRef;
};

export const createAuthUserWithEmailAndPassword = async (email, password) => {
  if (!email || !password) return;

  return await createUserWithEmailAndPassword(auth, email, password);
};

export const signInAuthUserWithEmailAndPassword = async (email, password) => {
  if (!email || !password) return;

  return await signInWithEmailAndPassword(auth, email, password);
};

export const signOutUser = async () => await signOut(auth);

export const onAuthStateChangedListener = (callback) =>
  onAuthStateChanged(auth, callback);

export const getFoodEntries = async (userAuth, date) => {
  const subColRef = collection(db, "users", userAuth.uid, "foodEntries");

  const qSnap = await getDocs(subColRef);

  return qSnap.docs.map((d) => ({ id: d.id, ...d.data() }));
};

export const addFoodEntry = async (userAuth, newEntry) => {
  const docRef = await addDoc(
    collection(db, "users", userAuth.uid, "foodEntries"),
    {
      name: newEntry.name,
      calories: newEntry.calories,
      timestamp: serverTimestamp(),
    }
  );
  const docSnap = await getDoc(docRef);

  return { id: docSnap.id, ...docSnap.data() };
};

export const getCalorieLimit = async (userAuth) => {
  const docRef = doc(db, "users", userAuth.uid);

  const docSnap = await getDoc(docRef);

  return docSnap.data().dailyCalorieLimit;
};
