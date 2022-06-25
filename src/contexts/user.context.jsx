import { createContext, useState, useEffect } from "react";
import usePersistStateHook from "../hooks/usePersistState.hook";

import {
  onAuthStateChangedListener,
  createUserDocumentFromAuth,
  getUserDoc,
} from "../utils/firebase/firebase.utils";

export const UserContext = createContext({
  setCurrentUser: () => null,
  currentUser: {
    ...JSON.parse(localStorage.getItem("user")),
  },
});

export const UserProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = usePersistStateHook("user", {
    ...JSON.parse(localStorage.getItem("user")),
  });

  const value = { currentUser, setCurrentUser };

  useEffect(() => {
    const unsubscribe = onAuthStateChangedListener(async (user) => {
      let userData;
      if (user) {
        await createUserDocumentFromAuth(user);
        const userDoc = await getUserDoc(user);
        userData = {
          ...user,
          dailyCalorieLimit: userDoc.dailyCalorieLimit,
          role: userDoc.role,
        };
      }
      setCurrentUser({
        ...userData,
      });
    });
    return unsubscribe;
  }, []);

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};
