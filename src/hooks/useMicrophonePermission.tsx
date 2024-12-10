import React, { useEffect, useState } from "react";

interface MicrophonePermissionProps {}

export const microphonePermissionEventTarget = new EventTarget();

type PermissionStatus = boolean | null;

function dispatchMicrophonePermissionChange(status: PermissionStatus) {
  const event = new CustomEvent("microphone-permission-change", {
    detail: status
  });
  microphonePermissionEventTarget.dispatchEvent(event);
}

export const getMicrophonePermission = async () => {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    if (stream) {
      dispatchMicrophonePermissionChange(true);
    }
  } catch (error) {
    dispatchMicrophonePermissionChange(false);
  }
};

export const useMicrophonePermission = () => {
  const [isMicrophonePermissionGiven, setIsMicrophonePermissionGiven] =
    useState<boolean | null>(null);

  useEffect(() => {
    const onMicrophonePermissionChange = (event: Event) => {
      const customEvent = event as CustomEvent<boolean | null>;
      setIsMicrophonePermissionGiven(customEvent.detail);
    };

    microphonePermissionEventTarget.addEventListener(
      "microphone-permission-change",
      onMicrophonePermissionChange
    );

    if (isMicrophonePermissionGiven === null) {
      getMicrophonePermission();
    }

    return () => {
      microphonePermissionEventTarget.removeEventListener(
        "microphone-permission-change",
        onMicrophonePermissionChange
      );
    };
  }, [isMicrophonePermissionGiven]);

  return isMicrophonePermissionGiven;
};
