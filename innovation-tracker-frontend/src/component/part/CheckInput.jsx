import { forwardRef, useState } from "react";

const CheckInput = forwardRef(function CheckInput(
  {
    label = "",
    forInput,
    type = "text",
    placeholder = "",
    isRequired = false,
    isDisabled = false,
    isRound = false,
    textAlign = "start",
    errorMessage,
    ...props
  },
  ref
) {
  const [checkedStates, setCheckedStates] = useState(false);

  const handleCheckboxChange = () => {
    if (checkedStates) ref = "";
    setCheckedStates(!checkedStates);
  };

  return (
    <>
      <div className="mb-3">
        <div className="input-group">
          <div className="d-flex align-items-center me-2">
            <input
              className="form-check-input mt-0"
              type="checkbox"
              checked={checkedStates}
              onChange={() => handleCheckboxChange()}
            />
          </div>
          <div class="form-floating mb-3">
            <input
              type="text"
              class="form-control rounded-5 ps-3"
              id="floatingInput"
              placeholder="name@example.com"
            />
            <label for="floatingInput">Email address</label>
          </div>
          {/* <input
            id={forInput}
            name={forInput}
            type={type}
            className={
              isRound
                ? "form-control text-" + textAlign
                : "form-control rounded-5 text-" + textAlign
            }
            placeholder={placeholder}
            ref={ref}
            disabled={!checkedStates}
            {...props}
          /> */}
        </div>
        {errorMessage ? (
          <span className="ms-4 small ms-1 text-danger">
            {placeholder.charAt(0).toUpperCase() +
              placeholder.substr(1).toLowerCase() +
              " " +
              errorMessage}
          </span>
        ) : (
          ""
        )}
      </div>
    </>
  );
});

export default CheckInput;
