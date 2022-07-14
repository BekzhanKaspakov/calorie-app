import { User } from "firebase/auth";
import { DocumentData } from "firebase/firestore";
import { createContext, useEffect } from "react";
import usePersistStateHook from "../hooks/usePersistState.hook";

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
  const { state, setState } = usePersistStateHook("user", {
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

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};
