import React, { createContext, useState, useCallback } from "react";
import Toast from "./Toast";

const ToastContext = createContext();

export default ToastContext;

export function ToastContextProvider({ children }) {
  const [state, setState] = useState({
    isToastOpen: false,
    toastSeverity: "success",
    toastMessage: "",
  });

  const setToastOpen = (isOpen) => {
    if (isOpen !== state.isToastOpen) {
      setState({ ...state, isToastOpen: isOpen });
    }
  };

  const onSuccess = useCallback(
    (message) => {
      setState({
        isToastOpen: true,
        toastSeverity: "success",
        toastMessage: message,
      });
    },
    [setState]
  );

  const onError = useCallback(
    (message) => {
      setState({
        isToastOpen: true,
        toastSeverity: "error",
        toastMessage: message,
      });
    },
    [setState]
  );

  return (
    <ToastContext.Provider value={{ onSuccess, onError }}>
      {children}
      <Toast
        alertSeverity={state.toastSeverity}
        alertMessage={state.toastMessage}
        open={state.isToastOpen}
        setOpen={setToastOpen}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      />
    </ToastContext.Provider>
  );
}
