import { User } from "firebase/auth";
import browserStorage from "store";
import { DocumentData } from "firebase/firestore";
import { createContext, useEffect, useState } from "react";

import {
  onAuthStateChangedListener,
  createUserDocumentFromAuth,
  getUserDoc,
} from "../utils/firebase/firebase.util";

export const UserContext = createContext({
  setState: (newState: UserData) => {},
  state: {
    ...JSON.parse(localStorage.getItem("user") || "{}"),
  } as UserData,
});

export type UserDoc = {
  createdAt: string;
  dailyCalorieLimit: 2100;
  displayName: string;
  email: string;
  role?: string;
  id: string;
};

export type UserData = User & UserDoc;

type UserProviderProps = {
  children: React.ReactNode;
};

export const UserProvider = ({ children }: UserProviderProps) => {
  const [state, setState] = useState({
    ...JSON.parse(localStorage.getItem("user") || "{}"),
  });

  const value = { state, setState };

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
      setState({
        ...userData,
      } as UserData);
    });
    return unsubscribe;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (state != null && Object.keys(state).length > 0) {
      browserStorage.set("user", state);
    }
  }, [state]);

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};
