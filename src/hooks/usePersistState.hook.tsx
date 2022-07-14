import { useState, useEffect } from "react";
import browserStorage from "store";
import { UserData } from "../contexts/user.context";

const usePersistState = (storageKey: string, initialState: UserData) => {
  const [state, setInternalState] = useState<UserData>(initialState);

  useEffect(() => {
    const storageInBrowser = browserStorage.get(storageKey);

    if (storageInBrowser) {
      setInternalState(storageInBrowser);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const setState = (newState: UserData) => {
    if (newState != null && Object.keys(newState).length > 0) {
      browserStorage.set(storageKey, newState);
    }
    setInternalState(newState);
  };

  return { state, setState };
};

export default usePersistState;
