import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";

interface MultiDisplayDetectionProps {}

export const useMultiDisplayDetection = () => {
  const [isMultipleDisplaysDetected, setIsMultipleDisplaysDetected] = useState<
    boolean | null
  >(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const getIsDisplayExtended = () => {
      try {
        //@ts-ignore
        const isDisplayExtended = window.screen?.isExtended;

        if (isDisplayExtended) {
          setIsMultipleDisplaysDetected(true);
        } else {
          console.log("Only one screen detected");
          setIsMultipleDisplaysDetected(false);
        }
      } catch (err) {
        setError("Screen sharing is required");
        toast.error("Screen sharing is required for the exam");
      }
    };

    getIsDisplayExtended();
  }, []);

  return isMultipleDisplaysDetected;
};
