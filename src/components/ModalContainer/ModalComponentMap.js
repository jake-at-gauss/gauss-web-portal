import GenericMessageModal from "./GenericMessageModal/GenericMessageModal";
import {
  GENERIC_MESSAGE_MODAL,
  PROMPT_BUTTON_MODAL,
  UPLOAD_SUCCESS_MODAL,
  VIEW_PHOTO_MODAL,
} from "./ModalConstants";
import PromptButtonModal from "./PromptButtonModal/PromptButtonModal";
import UploadSuccessModal from "./UploadSuccessModal/UploadSuccessModal";
import ViewPhotoModal from "./ViewPhotoModal/ViewPhotoModal";

const ModalComponentMap = {
  [UPLOAD_SUCCESS_MODAL]: UploadSuccessModal,
  [VIEW_PHOTO_MODAL]: ViewPhotoModal,
  [GENERIC_MESSAGE_MODAL]: GenericMessageModal,
  [PROMPT_BUTTON_MODAL]: PromptButtonModal,
};

export default ModalComponentMap;
