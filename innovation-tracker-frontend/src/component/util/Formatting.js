import moment from "moment";
import "moment/dist/locale/en-gb";

export const separator = (input) => {
  let parsedInput = parseFloat(input.toString().replace(/\./g, ""));

  if (isNaN(parsedInput)) return "";

  const options = {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
    useGrouping: true,
    decimal: ",",
    thousands: ".",
  };

  return parsedInput.toLocaleString("id-ID", options);
};

export const clearSeparator = (input) => {
  if (input) {
    let parsedInput = parseFloat(input.toString().replace(/\./g, ""));
    return parsedInput;
  }
  return 0;
};

export const formatDate = (input, dateOnly = false) => {
  return dateOnly
    ? moment(input).format("DD MMM yyyy")
    : moment(input).format("DD MMM yyyy, HH:mm");
};

export const maxCharDisplayed = (text, maxLength = 50) => {
  if (!text) return "";
  return text.length > maxLength ? text.substring(0, maxLength) + "..." : text;
};

export const decodeHtml = (html) => {
  const txt = document.createElement("textarea");
  txt.innerHTML = html;
  return txt.value;
};
