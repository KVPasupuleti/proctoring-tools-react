import React from "react";
import Modal from "react-modal";
import { requestFullScreen } from "../hooks/useFullScreenHandler";

export enum IntegrityTypes {
  MULTIPLE_DISPLAYS_DETECTED,
  SCREEN_NOT_SHARED,
  SCREEN_WRONGLY_SHARED,
  FULL_SCREEN_EXITED,
  CAMERA_PERMISSION_NOT_GIVEN,
  MICROPHONE_PERMISSION_NOT_GIVEN,
  TAB_NOT_ACTIVE,
  NOISE_DETECTED
}

interface IntegrityPopupProps {
  type: IntegrityTypes | undefined;
  isActive: boolean;
  onClose: VoidFunction;
  onClickHandler: VoidFunction;
}

const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)"
  }
};

const IntegrityPopup = ({
  isActive,
  type,
  onClose,
  onClickHandler
}: IntegrityPopupProps) => {
  const onClickButton = () => {
    onClickHandler();
  };

  const getButtonText = () => {
    if (type === IntegrityTypes.TAB_NOT_ACTIVE) {
      return "Okay";
    } else if (type === IntegrityTypes.CAMERA_PERMISSION_NOT_GIVEN) {
      return "Request Camera Permissions";
    } else if (type === IntegrityTypes.MICROPHONE_PERMISSION_NOT_GIVEN) {
      return "Request Microphone Permissions";
    } else if (type === IntegrityTypes.MULTIPLE_DISPLAYS_DETECTED) {
      return "Reload";
    } else if (type === IntegrityTypes.FULL_SCREEN_EXITED) {
      return "Go Fullscreen";
    } else if (type === IntegrityTypes.SCREEN_NOT_SHARED) {
      return "Please share your entire screen";
    } else if (type === IntegrityTypes.SCREEN_WRONGLY_SHARED) {
      return "Reload";
    }
  };

  const getMessage = () => {
    if (type === IntegrityTypes.TAB_NOT_ACTIVE) {
      return "You should not move out of the assessment tab";
    } else if (type === IntegrityTypes.CAMERA_PERMISSION_NOT_GIVEN) {
      return "You should give Camera Permissions to start the assessment";
    } else if (type === IntegrityTypes.MICROPHONE_PERMISSION_NOT_GIVEN) {
      return "You should give Microphone Permissions to start the assessment";
    } else if (type === IntegrityTypes.MULTIPLE_DISPLAYS_DETECTED) {
      return "Disconnect additional display and reload";
    } else if (type === IntegrityTypes.FULL_SCREEN_EXITED) {
      return "You should attempt the assessment only in Fullscreen";
    } else if (type === IntegrityTypes.SCREEN_NOT_SHARED) {
      return "You should share the entire screen to start the assessment";
    } else if (type === IntegrityTypes.SCREEN_WRONGLY_SHARED) {
      return "Looks like you haven't shared the entire screen. Please reload and share the Entire screen";
    }
  };

  return (
    <Modal
      isOpen={isActive}
      // onAfterOpen={afterOpenModal}
      // onRequestClose={onClose}
      style={customStyles}
      contentLabel="Example Modal"
    >
      <p>{getMessage()}</p>
      <button onClick={onClickButton}>{getButtonText()}</button>
    </Modal>
  );
};

export default IntegrityPopup;
