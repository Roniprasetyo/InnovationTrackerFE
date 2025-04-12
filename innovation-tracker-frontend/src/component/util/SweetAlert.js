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

    if (confirmText === "Reject") {
      inputElement = document.createElement("textarea");
      inputElement.placeholder = placeholder || "Please enter a reason for rejection...";
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

    return new Promise((resolve) => {
      swal({
        title: title,
        text: text,
        icon: icon,
        content: inputElement || undefined,
        buttons: {
          cancel: "Cancel",
          confirm: {
            text: confirmText,
            value: true,
          },
        },
        dangerMode: icon === "warning",
      }).then((value) => {
        if (value) {
          if (confirmText === "Reject") {
            const result = inputElement.value.trim();
            if (result === "") {
              swal("Reason is required!", "Please enter a reason for rejection.", "error").then(() => {
                SweetAlert(title, text, icon, confirmText, inputType, placeholder, html).then(resolve);
              });
              return;
            }
            resolve(result);
          } else {
            resolve(value);
          }
        } else {
          resolve(null);
        }
      });
    });
  }
};

export default SweetAlert;
