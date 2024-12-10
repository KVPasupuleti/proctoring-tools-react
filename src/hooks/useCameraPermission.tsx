import React, { useEffect, useState } from "react";

interface CameraPermissionProps {}

export const cameraPermissionEventTarget = new EventTarget();

type PermissionStatus = boolean | null;

function dispatchCameraPermissionChange(status: PermissionStatus) {
  const event = new CustomEvent("camera-permission-change", {
    detail: status
  });
  cameraPermissionEventTarget.dispatchEvent(event);
}

export const getCameraPermission = async () => {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    if (stream) {
      dispatchCameraPermissionChange(true);
    }
  } catch (error) {
    dispatchCameraPermissionChange(false);
  }
};

export const useCameraPermission = () => {
  const [isCameraPermissionGiven, setIsCameraPermissionGiven] = useState<
    boolean | null
  >(null);

  useEffect(() => {
    const onCameraPermissionChange = (event: Event) => {
      const customEvent = event as CustomEvent<boolean | null>;
      setIsCameraPermissionGiven(customEvent.detail);
    };

    cameraPermissionEventTarget.addEventListener(
      "camera-permission-change",
      onCameraPermissionChange
    );

    if (isCameraPermissionGiven === null) {
      getCameraPermission();
    }

    return () => {
      cameraPermissionEventTarget.removeEventListener(
        "camera-permission-change",
        onCameraPermissionChange
      );
    };
  }, [isCameraPermissionGiven]);

  return isCameraPermissionGiven;
};
