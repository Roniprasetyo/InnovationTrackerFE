import swal from "sweetalert";

const SweetAlert = (
  title,
  text,
  icon,
  confirmText = "",
  inputType = null,
  placeholder = "",
  html = null
) => {
  if (confirmText === "") {
    return swal({
      title: title,
      text: text,
      icon: icon,
      content: html
        ? { element: "div", attributes: { innerHTML: html } }
        : undefined,
    });
  } else {
    let inputElement = null;

    // Cuma buat REJECT pakai textarea
    if (confirmText === "REJECT") {
      inputElement = document.createElement("textarea");
      inputElement.placeholder = placeholder || "Please enter a reason for rejection....";
      inputElement.rows = 4;
      inputElement.style.width = "100%";
      inputElement.style.padding = "8px";
      inputElement.style.border = "1px solid #ccc";
      inputElement.style.borderRadius = "5px";
      inputElement.style.fontSize = "16px";
      inputElement.style.boxSizing = "border-box";
      inputElement.style.resize = "vertical";
      inputElement.style.marginTop = "10px";
    }

    return swal({
      title: title,
      text: text,
      icon: icon,
      content: inputElement || undefined,
      buttons: {
        cancel: "Batal",
        confirm: {
          text: confirmText,
          value: true,
        },
      },
      dangerMode: icon === "warning",
    }).then((value) => {
      if (confirmText === "REJECT" && value) {
        const result = inputElement.value.trim();
        return result === "" ? "-" : result;
      }
      return value;
    });
  }
};

export default SweetAlert;
