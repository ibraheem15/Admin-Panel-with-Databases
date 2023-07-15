import { createContext, useContext, useMemo } from "react";
import { useSetState } from "react-use";

const appState = {
  run: false,
  stepIndex: 0,
  steps: [],
  tourActive: false,
};

export const AppContext = createContext({
  state: appState,
  setState: () => undefined,
});
AppContext.displayName = "AppContext";

export function AppProvider(props) {
  const [state, setState] = useSetState(appState);

  const value = useMemo(
    () => ({
      state,
      setState,
    }),
    [setState, state]
  );

  return <AppContext.Provider value={value} {...props} />;
}

export function useAppContext() {
  const context = useContext(AppContext);

  if (!context) {
    throw new Error("useAppContext must be used within a AppProvider");
  }

  return context;
}
