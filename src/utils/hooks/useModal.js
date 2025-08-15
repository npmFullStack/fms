import { useState, useCallback } from "react";

const useModal = (onCloseCallback = null) => {
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const clearMessage = useCallback(() => {
    setMessage("");
  }, []);

  const setSuccessMessage = useCallback((msg) => {
    setMessage({ type: "success", text: msg });
  }, []);

  const setErrorMessage = useCallback((msg) => {
    setMessage({ type: "error", text: msg });
  }, []);

  const handleClose = useCallback(() => {
    setMessage("");
    setIsLoading(false);
    if (onCloseCallback) {
      onCloseCallback();
    }
  }, [onCloseCallback]);

  return {
    message,
    isLoading,
    setIsLoading,
    clearMessage,
    setSuccessMessage,
    setErrorMessage,
    handleClose
  };
};

export default useModal;