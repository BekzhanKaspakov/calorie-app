import { useState, useEffect } from "react";
import browserStorage from "store";

const usePersistState = (storageKey, initialState) => {
  const [state, setInternalState] = useState(initialState);

  useEffect(() => {
    const storageInBrowser = browserStorage.get(storageKey);

    if (storageInBrowser) {
      setInternalState(storageInBrowser);
    }
  }, []);

  const setState = (newState) => {
    if (newState != null && Object.keys(newState).length > 0) {
      browserStorage.set(storageKey, newState);
    }
    setInternalState(newState);
  };

  return [state, setState];
};

export default usePersistState;
