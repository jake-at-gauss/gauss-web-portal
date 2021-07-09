import GenericMessageModal from "./GenericMessageModal/GenericMessageModal";
import {
  GENERIC_MESSAGE_MODAL,
  UPLOAD_SUCCESS_MODAL,
  VIEW_PHOTO_MODAL,
} from "./ModalConstants";
import UploadSuccessModal from "./UploadSuccessModal/UploadSuccessModal";
import ViewPhotoModal from "./ViewPhotoModal/ViewPhotoModal";

const ModalComponentMap = {
  [UPLOAD_SUCCESS_MODAL]: UploadSuccessModal,
  [VIEW_PHOTO_MODAL]: ViewPhotoModal,
  [GENERIC_MESSAGE_MODAL]: GenericMessageModal,
};

export default ModalComponentMap;
