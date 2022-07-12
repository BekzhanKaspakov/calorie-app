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
  Auth,
  User,
  NextOrObserver,
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
  collectionGroup,
  query,
  Timestamp,
  deleteDoc,
  orderBy,
  DocumentData,
} from "firebase/firestore";
import { idText } from "typescript";
import { FoodEntry } from "../../components/entry/entry.component";
import { InviteFriendFormFields } from "../../components/invite/invite.component";
import { isTypeAdminFormFields } from "../../components/modal/modal.component";
import { UserData, UserDoc } from "../../contexts/user.context";
import {
  AdminFoodEntry,
  AdminFormFields,
  isTypeAdminFoodEntry,
} from "../../routes/admin/admin.component";
import { FormFields } from "../../routes/journal/journal.component";

const firebaseConfig = {
  apiKey: "AIzaSyCJBG3woL6CYaVPSLlN7a9gBQ8ytliZXiw",
  authDomain: "calorie-app-3c5f4.firebaseapp.com",
  projectId: "calorie-app-3c5f4",
  storageBucket: "calorie-app-3c5f4.appspot.com",
  messagingSenderId: "434449718238",
  appId: "1:434449718238:web:b943cab63b25394f119b4f",
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
  userAuth: User,
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
    } catch (error: any) {
      console.log("error creating the user", error.message);
    }
  }

  return userDocRef;
};

export const createAuthUserWithEmailAndPassword = async (
  email: string,
  password: string
) => {
  if (!email || !password) return;

  return await createUserWithEmailAndPassword(auth, email, password);
};

export const signInAuthUserWithEmailAndPassword = async (
  email: string,
  password: string
) => {
  if (!email || !password) return;

  return await signInWithEmailAndPassword(auth, email, password);
};

export const signOutUser = async () => await signOut(auth);

export const onAuthStateChangedListener = (callback: any) =>
  onAuthStateChanged(auth, callback);

export const getAllUsers = async () => {
  const usersColRef = collection(db, "users");

  const qSnap = await getDocs(usersColRef);

  return qSnap.docs.map((d) => ({ ...(d.data() as UserDoc), id: d.id }));
};

export const getAllFoodEntries = async () => {
  const foodEntries = query(
    collectionGroup(db, "foodEntries"),
    orderBy("timestamp", "desc")
  );
  const querySnapshot = await getDocs(foodEntries);

  const data = querySnapshot.docs.map((d: DocumentData) => ({
    id: d.id,
    ...d.data(),
    userId: d.ref.parent.parent.id,
  }));

  return data;
};
export const getFoodEntries = async (userAuth: User): Promise<FoodEntry[]> => {
  const subColRef = collection(db, "users", userAuth.uid, "foodEntries");

  const qSnap = await getDocs(query(subColRef, orderBy("timestamp", "desc")));

  return qSnap.docs.map((d) => ({
    id: d.id,
    name: d.data().name,
    timestamp: d.data().timestamp,
    calories: d.data().calories,
  }));
};

export const addFoodEntry = async (
  userAuth: User,
  newEntry: AdminFormFields | FormFields
): Promise<AdminFoodEntry | FoodEntry | null> => {
  const uid =
    isTypeAdminFormFields(newEntry) && newEntry.userId != null
      ? newEntry.userId
      : userAuth.uid;
  const timestamp =
    isTypeAdminFormFields(newEntry) && newEntry.datePickerTimestamp != null
      ? Timestamp.fromDate(new Date(newEntry.datePickerTimestamp))
      : serverTimestamp();
  const docRef = await addDoc(collection(db, "users", uid, "foodEntries"), {
    name: newEntry.name,
    calories: newEntry.calories,
    timestamp: timestamp,
  });

  const docSnap = await getDoc(docRef);
  const newEntryData = docSnap.data();

  if (newEntryData == null) return null;
  return {
    id: newEntryData.id,
    userId: newEntryData.userId,
    name: newEntryData.name,
    calories: newEntryData.calories,
    timestamp: newEntryData.timestamp,
  };
};

export const editFoodEntry = async (
  oldUserId: string,
  newEntryData: AdminFormFields
) => {
  if (newEntryData.id == null || newEntryData.userId == null) {
    console.log("EditFoodEntry: Missing id or userId");
    return;
  }
  const timestamp =
    newEntryData.datePickerTimestamp != null
      ? Timestamp.fromDate(new Date(newEntryData.datePickerTimestamp))
      : serverTimestamp();

  // Check if user owning this entry was changed
  // If yes delete from old user's subcollection, then add to new users subcollection
  if (newEntryData.id != null && oldUserId !== newEntryData.userId) {
    await deleteDoc(
      doc(db, "users", oldUserId, "foodEntries", newEntryData.id)
    );
  }
  await setDoc(
    doc(db, "users", newEntryData.userId, "foodEntries", newEntryData.id),
    {
      name: newEntryData.name,
      calories: newEntryData.calories,
      timestamp: timestamp,
    }
  );

  return {
    id: newEntryData.id,
    userId: newEntryData.userId,
    name: newEntryData.name,
    calories: newEntryData.calories,
    timestamp: timestamp,
  };
};

export const deleteFoodEntry = async (entryData: AdminFormFields) => {
  if (entryData.id == null || entryData.userId == null) {
    console.log("DeleteFoodEntry: Missing id or userId");
    return;
  }
  await deleteDoc(
    doc(db, "users", entryData.userId, "foodEntries", entryData.id)
  );

  return;
};

export const getUserDoc = async (userAuth: UserData) => {
  const docRef = doc(db, "users", userAuth.uid);

  const docSnap = await getDoc(docRef);

  return { id: docSnap.id, ...docSnap.data() };
};

export const inviteFriend = async (formFields: InviteFriendFormFields) => {
  const { displayName, email } = formFields;
  const secondaryFirebaseApp = initializeApp(firebaseConfig, "secondary");
  const secondaryAuth = getAuth(secondaryFirebaseApp);
  const password = Math.random().toString(36).slice(-8);
  try {
    const userCredential = await createUserWithEmailAndPassword(
      secondaryAuth,
      email,
      password
    );

    const userDocRef = doc(db, "users", userCredential.user.uid);

    const userSnapshot = await getDoc(userDocRef);

    const createdAt = new Date();
    if (!userSnapshot.exists()) {
      await setDoc(userDocRef, {
        displayName,
        email,
        createdAt,
        generatedPassword: password,
        dailyCalorieLimit: 2100,
      });
    }
    return { displayName, email, createdAt, dailyCalorieLimit: 2100 };
  } catch (error: any) {
    console.log("error creating the user", error.message);
  }
};
