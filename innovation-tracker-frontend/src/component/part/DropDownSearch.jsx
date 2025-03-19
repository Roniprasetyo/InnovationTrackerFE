import React, { forwardRef, useEffect, useRef } from "react";
import Select from "react-select";
import "select2/dist/css/select2.css";
import "select2-bootstrap-5-theme/dist/select2-bootstrap-5-theme.min.css";

const DropDownSearch = forwardRef(function DropDownSearch(
  {
    arrData,
    label = "",
    isRequired = false,
    isDisabled = false,
    errorMessage,
    showLabel = true,
    onChange,
    value,
    placeholder = "-- Choose --",
    ...props
  },
  ref
) {
  const [selectedValue, setSelectedValue] = React.useState("");
  const Options = arrData.map((item) => ({
    value: item.Value,
    label: item.Text,
  }));

  // console.log("Options in DropDownSearch:", Options);

  const handleChange = (selectedOption) => {
    // console.log("Selected option from dropdown:", selectedOption);

    setSelectedValue(selectedOption ? selectedOption.value : "");
    onChange && onChange(selectedOption ? selectedOption.value : "");
  };

  useEffect(() => {
    setSelectedValue(value);
  }, [value]);

  // console.log("VALUE NYA ", selectedValue);

  return (
    <>
      <div className="mb-3">
        {showLabel && (
          <label className="form-label fw-bold">
            {label}
            {isRequired && <span className="text-danger"> *</span>}
            {errorMessage && (
              <span className="fw-normal text-danger"> {errorMessage}</span>
            )}
          </label>
        )}
        <Select
          ref={ref}
          options={Options}
          isDisabled={isDisabled}
          placeholder={placeholder}
          value={Options.find(
            (option) => Number(option.value) === Number(selectedValue)
          )}
          onChange={handleChange}
          isClearable
          className="basic-single rounded-5"
          classNamePrefix="select"
          {...props}
        />
      </div>
    </>
  );
});

export default DropDownSearch;
