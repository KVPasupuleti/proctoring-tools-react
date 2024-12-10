import React, { useEffect, useState } from "react";
import screenfull from "screenfull";
import toast from "react-hot-toast";

interface FullScreenHandlerProps {}

export const useFullScreenHandler = () => {
  const isInFullscreen = () => {
    return document.fullscreenElement !== null;
  };

  const [isUserFullScreen, setIsUserFullScreen] = useState(false);

  useEffect(() => {
    setIsUserFullScreen(isInFullscreen());

    const handleFullScreenChange = () => {
      setIsUserFullScreen(document.fullscreenElement !== null);
    };

    document.addEventListener("fullscreenchange", handleFullScreenChange);
    return () =>
      document.removeEventListener("fullscreenchange", handleFullScreenChange);
  }, []);

  return isUserFullScreen;
};

export const requestFullScreen = () => {
  screenfull.request();
};
