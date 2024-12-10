import React, { useEffect, useState } from "react";
import { Toaster } from "react-hot-toast";
import { useFaceDetection } from "./hooks/useFaceDetection";
import { useScreenCapture } from "./hooks/useScreenCapture";
import { useNoiseDetection } from "./hooks/useNoiseDetection";
import {
  requestFullScreen,
  useFullScreenHandler
} from "./hooks/useFullScreenHandler";
import { useTabFocusHandler } from "./hooks/useTabFocusHandler";
import { useMultiDisplayDetection } from "./hooks/useMultiDisplayDetection";
import IntegrityPopup, { IntegrityTypes } from "./components/IntegrityPopup";
import {
  getCameraPermission,
  useCameraPermission
} from "./hooks/useCameraPermission";
import {
  getMicrophonePermission,
  useMicrophonePermission
} from "./hooks/useMicrophonePermission";

const initialIntegrityConfig = {
  isMultipleDeviceDetectionPassed: false,
  isCameraPermissionGiven: false,
  isMicrophonePermissionGiven: false,
  isScreenSharingSuccess: false
};

function App() {
  const [isIntegrityPopupOpen, setIsIntegrityPopupOpen] =
    useState<boolean>(false);
  const [integrityType, setIntegrityType] = useState<IntegrityTypes>();

  const [integrityConfig, setIntegrityConfig] = useState(
    initialIntegrityConfig
  );
  const [violations, setViolations] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const isTabFocused = useTabFocusHandler();
  const isCameraPermissionGiven = useCameraPermission();
  const isMicrophonePermissionGiven = useMicrophonePermission();
  const isNoiseDetected = useNoiseDetection();

  const { isScreenShared, isEntireScreenNotShared, startScreenCapture } =
    useScreenCapture();
  const isUserFullScreen = useFullScreenHandler();
  const isMultipleDevicesDetected = useMultiDisplayDetection();

  useEffect(() => {
    if (!isTabFocused) {
      setIntegrityType(IntegrityTypes.TAB_NOT_ACTIVE);
      setIsIntegrityPopupOpen(true);
      handleViolation("You should not leave the assessment Tab");
    } else if (!isCameraPermissionGiven) {
      setIntegrityType(IntegrityTypes.CAMERA_PERMISSION_NOT_GIVEN);
      setIsIntegrityPopupOpen(true);
      handleViolation("Camera Permission not given");
    } else if (!isMicrophonePermissionGiven) {
      setIntegrityType(IntegrityTypes.MICROPHONE_PERMISSION_NOT_GIVEN);
      setIsIntegrityPopupOpen(true);
      handleViolation("Microphone permission not given");
    } else if (isNoiseDetected) {
      handleViolation("Noise Detected");
    } else if (!isScreenShared) {
      setIntegrityType(IntegrityTypes.SCREEN_NOT_SHARED);
      setIsIntegrityPopupOpen(true);
      handleViolation("Screen not shared");
    } else if (isEntireScreenNotShared) {
      setIntegrityType(IntegrityTypes.SCREEN_WRONGLY_SHARED);
      setIsIntegrityPopupOpen(true);
      handleViolation("Entire Screen not shared");
    } else if (isMultipleDevicesDetected) {
      setIntegrityType(IntegrityTypes.MULTIPLE_DISPLAYS_DETECTED);
      setIsIntegrityPopupOpen(true);
      handleViolation("Multiple Devices Detected");
    } else if (!isUserFullScreen) {
      setIntegrityType(IntegrityTypes.FULL_SCREEN_EXITED);
      setIsIntegrityPopupOpen(true);
      handleViolation("Full screen exited");
    } else {
      setIsIntegrityPopupOpen(false);
    }
  }, [
    isTabFocused,
    isMultipleDevicesDetected,
    isUserFullScreen,
    isScreenShared,
    isEntireScreenNotShared,
    isCameraPermissionGiven,
    isMicrophonePermissionGiven,
    isNoiseDetected
  ]);

  const handleViolation = (message: string) => {
    setViolations((prev) => [
      ...prev,
      `${new Date().toISOString()}: ${message}`
    ]);
  };

  const onClickHandler = () => {
    if (integrityType === IntegrityTypes.TAB_NOT_ACTIVE) {
      setIsIntegrityPopupOpen(false);
    }
    if (integrityType === IntegrityTypes.CAMERA_PERMISSION_NOT_GIVEN) {
      getCameraPermission();
    } else if (
      integrityType === IntegrityTypes.MICROPHONE_PERMISSION_NOT_GIVEN
    ) {
      getMicrophonePermission();
    } else if (integrityType === IntegrityTypes.MULTIPLE_DISPLAYS_DETECTED) {
      window.location.reload();
    } else if (integrityType === IntegrityTypes.FULL_SCREEN_EXITED) {
      requestFullScreen();
    } else if (integrityType === IntegrityTypes.SCREEN_NOT_SHARED) {
      startScreenCapture();
    } else if (integrityType === IntegrityTypes.SCREEN_WRONGLY_SHARED) {
      window.location.reload();
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Toaster position="top-right" />

      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Exam Proctoring System</h1>

        {isLoading ? (
          <div className="bg-white rounded-lg shadow p-4 mb-4">
            <p className="text-gray-600">Loading proctoring system...</p>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow p-4 mb-4">
            <h2 className="text-lg font-semibold mb-2">Violations Log</h2>
            <div className="h-48 overflow-y-auto">
              {violations.map((violation, index) => (
                <div key={index} className="text-sm text-red-600 mb-1">
                  {violation}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <IntegrityPopup
        isActive={isIntegrityPopupOpen}
        type={integrityType}
        onClose={() => {
          setIsIntegrityPopupOpen(false);
        }}
        onClickHandler={onClickHandler}
      />
    </div>
  );
}

export default App;
