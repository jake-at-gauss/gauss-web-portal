import { useEffect, useState } from "react";
import ModalContainer from "./ModalContainer";

let openModals = [];
const listeners = new Set();

const setOpenModals = (modals) => {
  openModals = modals;
  listeners.forEach((listener) => listener());
};

const closeModal = (keyToClose) =>
  setOpenModals(openModals.filter(({ key }) => key !== keyToClose));

const openModal = (modalType, config, allowDupes) => {
  const modalKey = allowDupes
    ? openModals.filter((modal) => modal.componentType === modalType).length +
      "_UID_" +
      modalType
    : modalType;

  // Disallow duplicates
  if (openModals.every(({ key }) => key !== modalKey)) {
    setOpenModals([
      ...openModals,
      {
        key: modalKey,
        componentType: modalType,
        config: config,
      },
    ]);
  }
};

// Custom hook for global modal service
export const useModalService = () => {
  const [modals, setModals] = useState(openModals);

  useEffect(() => {
    const listener = () => {
      setModals(openModals);
    };
    listeners.add(listener);
    listener();
    return () => listeners.delete(listener);
  }, []);

  return [modals, { closeModal, openModal }];
};

const ModalService = ({}) => {
  const [modals, _] = useModalService();

  return <ModalContainer openModals={modals} />;
};

export default ModalService;
