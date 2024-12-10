import { useEffect, useState } from "react";
import toast from "react-hot-toast";

interface TabFocusHandlerProps {
  onViolation: (message: string) => void;
}

export const useTabFocusHandler = () => {
  const [isTabActive, setIsTabActive] = useState<boolean | null>(true);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        setIsTabActive(false);
        toast.error("Please do not switch tabs or windows");
      } else {
        setIsTabActive(true);
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () =>
      document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, []);

  return isTabActive;
};
