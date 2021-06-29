import { isEmpty } from "lodash";
import React, { useEffect } from "react";

// Service Fns

// Component Map
import componentMap from "./ModalComponentMap";
import { useModalService } from "./ModalService";

const KEYCODE_ESC = 27;
let listener = undefined;

let setEscapeHandler = (fn) => {
  listener && listener();

  listener = window.addEventListener("keydown", fn);
};

const ModalContainer = ({ openModals }) => {
  const [_, { closeModal }] = useModalService();

  useEffect(() => {
    setEscapeHandler((e) => {
      e.keyCode === KEYCODE_ESC &&
        !isEmpty(openModals) &&
        closeModal(openModals[openModals.length - 1].key);
    });
  }, [openModals]);

  return (
    <div>
      {openModals.map(({ key, componentType, config }) => {
        const ModalComponent = componentMap[componentType];
        if (!ModalComponent) {
          console.error(`${componentType} does not have a corresponding modal`);
          return null;
        }

        return (
          <ModalComponent
            key={key}
            config={config}
            closeModal={() => closeModal(key)}
          />
        );
      })}
    </div>
  );
};

export default ModalContainer;
