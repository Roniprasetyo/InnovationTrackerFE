import { forwardRef, useState } from "react";
import { separator } from "../util/Formatting";

const Input = forwardRef(function Input(
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
  return (
    <>
      {label !== "" && (
        <div className="mb-3">
          <label htmlFor={forInput} className="form-label fw-bold ms-1 mb-1">
            {label}
            {isRequired ? <span className="text-danger"> *</span> : ""}
            {errorMessage ? (
              <span className="fw-normal text-danger"> {errorMessage}</span>
            ) : (
              ""
            )}
          </label>
          {type === "textarea" && (
            <textarea
              rows="5"
              id={forInput}
              name={forInput}
              className="form-control rounded-5 p-3"
              placeholder={placeholder}
              ref={ref}
              disabled={isDisabled}
              {...props}
            ></textarea>
          )}
          {type !== "textarea" && (
            <>
              <input
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
                disabled={isDisabled}
                {...props}
              />
              {type === "date" && placeholder !== "" && (
                <small className="ms-2">
                  <i> {placeholder}</i>
                </small>
              )}
            </>
          )}
        </div>
      )}
      {label === "" && (
        <>
          {type === "textarea" && (
            <textarea
              rows="5"
              id={forInput}
              name={forInput}
              className="form-control rounded-5 p-3"
              placeholder={placeholder}
              ref={ref}
              disabled={isDisabled}
              {...props}
            ></textarea>
          )}
          {type !== "textarea" && (
            <input
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
              disabled={isDisabled}
              {...props}
            />
          )}
          {errorMessage ? (
            <span className="small ms-1 text-danger">
              {placeholder.charAt(0).toUpperCase() +
                placeholder.substr(1).toLowerCase() +
                " " +
                errorMessage}
            </span>
          ) : (
            ""
          )}
        </>
      )}
    </>
  );
});

export default Input;
