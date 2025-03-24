import { forwardRef, useState, useEffect, useRef } from "react";
import Icon from "./Icon";

const SearchDropdown = forwardRef(function SearchDropdown(
  {
    arrData,
    label = "",
    placeHolder = "",
    forInput,
    isRequired = false,
    isRound = false,
    errorMessage,
    showLabel = true,
    value,
    onChange,
    isDisabled = false,
    ...props
  },
  ref
) {
  const [searchTerm, setSearchTerm] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [firstOpen, setFirstOpen] = useState(false);
  const wrapperRef = useRef(null);

  useEffect(() => {
    if (!value || value === null || value === "") {
      setSearchTerm("");
    } else {
      const matchedData = arrData.find((data) => data.Value === value);
      setSearchTerm(matchedData ? matchedData.Text : "");
    }
  }, [value, arrData]);

  const handleInputChange = (e) => {
    setSearchTerm(e.target.value);
    setDropdownOpen(true);
    setFirstOpen(true);
  };

  const handleOptionClick = (selectedValue, text) => {
    onChange({ target: { name: forInput, value: selectedValue } });
    setSearchTerm(text);
    setDropdownOpen(false);
    setFirstOpen(false);
  };

  const handleClickOutside = (event) => {
    if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
      setDropdownOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredData =
    Array.isArray(arrData) && arrData.length > 0
      ? !firstOpen
        ? arrData
        : arrData.filter((data) =>
            data.Text.toLowerCase().includes(searchTerm.toLowerCase())
          )
      : [];

  return (
    <>
      {label !== "" && (
        <div className="mb-3 position-relative">
          <label htmlFor={forInput} className="form-label fw-bold">
            {label}
            {isRequired ? <span className="text-danger"> *</span> : ""}
            {errorMessage ? (
              <span className="fw-normal text-danger"> {errorMessage}</span>
            ) : (
              ""
            )}
          </label>

          <div
            className="dropdown-wrapper"
            style={{ position: "relative" }}
            ref={wrapperRef}
          >
            <input
              ref={ref}
              type="text"
              id={forInput}
              name={forInput}
              className={`form-control ${isRound ? "rounded-5" : ""} ${
                errorMessage ? "is-invalid" : ""
              }`}
              placeholder={`-- Select ${placeHolder} --`}
              value={searchTerm}
              onChange={handleInputChange}
              onFocus={() => setDropdownOpen(true)}
              disabled={isDisabled}
              {...props}
            />

            <Icon
              name="angle-small-down me-2"
              style={{
                position: "absolute",
                top: "50%",
                right: "10px",
                transform: "translateY(-50%)",
                cursor: "pointer",
              }}
              onClick={() => setDropdownOpen(!dropdownOpen)}
            />

            {dropdownOpen && filteredData.length > 0 && (
              <ul
                className="dropdown-menu py-1 show"
                style={{
                  position: "absolute",
                  top: "100%",
                  left: 0,
                  width: "100%",
                  zIndex: 10,
                  maxHeight: "200px",
                  overflowY: "auto",
                  background: "white",
                  border: "1px solid #ddd",
                  listStyle: "none",
                  padding: 0,
                  margin: 0,
                }}
              >
                {filteredData.map((data) => (
                  <li
                    key={data.Value}
                    className="dropdown-item"
                    onClick={() => handleOptionClick(data.Value, data.Text)}
                    style={{
                      padding: "10px",
                      cursor: "pointer",
                      borderBottom: "1px solid #f1f1f1",
                    }}
                  >
                    {data.Text}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}
      {label === "" && (
        <>
          <div
            className="dropdown-wrapper"
            style={{ position: "relative" }}
            ref={wrapperRef}
          >
            <input
              ref={ref}
              type="text"
              id={forInput}
              name={forInput}
              className={`form-control ${isRound ? "rounded-5" : ""} ${
                errorMessage ? "is-invalid" : ""
              }`}
              placeholder={`-- Choose ${placeHolder} --`}
              value={searchTerm}
              onChange={handleInputChange}
              onFocus={() => setDropdownOpen(true)}
              disabled={isDisabled}
              {...props}
            />

            <Icon
              name="angle-small-down me-2"
              style={{
                position: "absolute",
                top: "50%",
                right: "10px",
                transform: "translateY(-50%)",
                cursor: "pointer",
              }}
              onClick={() => setDropdownOpen(!dropdownOpen)}
            />

            {dropdownOpen && filteredData.length > 0 && (
              <ul
                className="dropdown-menu py-1 show"
                style={{
                  position: "absolute",
                  top: "100%",
                  left: 0,
                  width: "100%",
                  zIndex: 10,
                  maxHeight: "200px",
                  overflowY: "auto",
                  background: "white",
                  border: "1px solid #ddd",
                  listStyle: "none",
                  padding: 0,
                  margin: 0,
                }}
              >
                {filteredData.map((data) => (
                  <li
                    key={data.Value}
                    className="dropdown-item"
                    onClick={() => handleOptionClick(data.Value, data.Text)}
                    style={{
                      padding: "10px",
                      cursor: "pointer",
                      borderBottom: "1px solid #f1f1f1",
                    }}
                  >
                    {data.Text}
                  </li>
                ))}
              </ul>
            )}
          </div>
          {errorMessage ? (
            <span className="small ms-1 text-danger">
              {placeHolder.charAt(0).toUpperCase() +
                placeHolder.substr(1).toLowerCase() +
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

export default SearchDropdown;