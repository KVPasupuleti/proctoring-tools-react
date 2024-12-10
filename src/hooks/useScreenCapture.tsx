import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";

interface ScreenCaptureProps {}

export const useScreenCapture = () => {
  const [isScreenShared, setIsScreenShared] = useState(false);
  const [isEntireScreenNotShared, setIsEntireScreenNotShared] = useState(false);
  const [screenStream, setScreenStream] = useState<MediaStream | null>(null);
  const [error, setError] = useState<string | null>(null);

  const startScreenCapture = async () => {
    try {
      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
        audio: false
      });

      const track = stream.getVideoTracks()[0];
      const settings = track.getSettings();

      if (settings.displaySurface !== "monitor") {
        track.stop();
        setIsScreenShared(true);
        setIsEntireScreenNotShared(true);
        setError("Please share your entire screen");
        return;
      }

      setScreenStream(stream);
      setIsScreenShared(true);
      setIsEntireScreenNotShared(false);
      setError(null);

      track.onended = () => {
        setScreenStream(null);
        setError("Screen sharing stopped");
        toast.error("Please share your screen to continue");
      };
    } catch (err) {
      setIsScreenShared(false);
      setError("Screen sharing is required");
      toast.error("Screen sharing is required for the exam");
    }
  };

  useEffect(() => {
    if (screenStream) {
      setIsScreenShared(true);
    } else if (!screenStream && !error) {
      setIsScreenShared(false);
    }

    return () => {
      if (screenStream) {
        screenStream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [screenStream]);

  // if (error) {
  //   return (
  //     <div className="bg-red-50 p-4 rounded-lg mb-4">
  //       <p className="text-red-600">{error}</p>
  //       <button
  //         className="mt-2 bg-blue-500 text-white px-4 py-2 rounded"
  //         onClick={() => {
  //           setScreenStream(null);
  //           setError(null);
  //         }}
  //       >
  //         Share Entire Screen
  //       </button>
  //     </div>
  //   );
  // }

  return { isScreenShared, isEntireScreenNotShared, startScreenCapture };
};
