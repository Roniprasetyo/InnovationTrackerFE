import { forwardRef, useImperativeHandle, useRef } from "react";
import Button from "./Button";

const Modal = forwardRef(function Modal(
  { title, children, size, Button1 = null, Button2 = null, centered = false },
  ref
) {
  const dialog = useRef();
  let maxSize;

  switch (size) {
    case "small":
      maxSize = "480px";
      break;
    case "medium":
      maxSize = "720px";
      break;
    case "large":
      maxSize = "1024px";
      break;
    case "full":
      maxSize = "100%";
      break;
  }

  useImperativeHandle(ref, () => {
    return {
      open() {
        dialog.current.showModal();
      },
      close() {
        dialog.current.close();
      },
    };
  });

  return (
    <dialog
      ref={dialog}
      style={
        centered === false
          ? { maxWidth: maxSize }
          : {
              maxWidth: maxSize,
              position: "fixed",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              margin: 0,
              border: "none",
              borderRadius: "8px",
              zIndex: 1000,
            }
      }
    >
      <div className="modal-header lead fw-medium p-3">{title}</div>
      <hr className="m-0" />
      <div className="modal-body p-3">{children}</div>
      <hr className="m-0" />
      <div className="modal-footer p-3">
        <form method="dialog">
          <Button
            classType="secondary"
            label="Cancel"
            onClick={() => {
              dialog.current.close();
            }}
          />
          {Button1}
          {Button2}
        </form>
      </div>
    </dialog>
  );
});

export default Modal;
