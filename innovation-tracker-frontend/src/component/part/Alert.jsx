export default function Alert({ type, message, handleClose = () => {} }) {
  return (
    <div className={"alert alert-" + type + " alert-dismissible"} role="alert">
      {message}
      <button
        type="button"
        className="btn-close"
        aria-label="Close"
        onClick={handleClose}
      ></button>
    </div>
  );
}
