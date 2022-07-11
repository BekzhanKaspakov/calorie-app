import { User } from "firebase/auth";
import { DocumentData } from "firebase/firestore";
import { createContext, useState, useEffect } from "react";
import usePersistStateHook from "../hooks/usePersistState.hook";

import {
  onAuthStateChangedListener,
  createUserDocumentFromAuth,
  getUserDoc,
} from "../utils/firebase/firebase.util";

export const UserContext = createContext({
  setCurrentUser: () => null,
  currentUser: {
    ...JSON.parse(localStorage.getItem("user") || ""),
  },
});

export type UserData = User & {
  createdAt: string;
  dailyCalorieLimit: 2100;
  displayName: string;
  email: string;
  role?: string;
};

type UserProviderProps = {
  children: React.ReactNode;
};

export const UserProvider = ({ children }: UserProviderProps) => {
  const [currentUser, setCurrentUser] = usePersistStateHook("user", {
    ...JSON.parse(localStorage.getItem("user") || ""),
  });

  const value = { currentUser, setCurrentUser };

  useEffect(() => {
    const unsubscribe = onAuthStateChangedListener(async (user: UserData) => {
      let userData;
      if (user) {
        await createUserDocumentFromAuth(user);
        const userDoc: DocumentData | undefined = await getUserDoc(user);
        if (userDoc !== undefined) {
          userData = {
            ...user,
            dailyCalorieLimit: userDoc.dailyCalorieLimit,
            role: userDoc.role,
          };
        }
      }
      setCurrentUser({
        ...userData,
      });
    });
    return unsubscribe;
  }, []);

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};
