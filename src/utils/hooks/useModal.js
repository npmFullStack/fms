import { useState, useCallback } from "react";

const useModal = (onCloseCallback = null) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleClose = useCallback(() => {
    setIsLoading(false);
    if (onCloseCallback) {
      onCloseCallback();
    }
  }, [onCloseCallback]);

  return {
    isLoading,
    setIsLoading,
    handleClose
  };
};

export default useModal;
